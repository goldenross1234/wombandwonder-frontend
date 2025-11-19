import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";          // ✔ global axios with dynamic baseURL
import { loadConfig } from "../../config/runtimeConfig";  // ✔ named import
import "./BannerManager.css";

export default function BannerManager() {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [backendBase, setBackendBase] = useState("");

  // ==========================================
  // Load config.json + fetch banners
  // ==========================================
  useEffect(() => {
    async function init() {
      try {
        // Load backend URL
        const config = await loadConfig();
        setBackendBase(config.backend_url.replace("/api", ""));

        // Load banners
        const res = await axios.get("banners/");
        setBanners(res.data);
      } catch (err) {
        console.error("Init error:", err);
      }
    }

    init();
  }, []);

  // ==========================================
  // Fetch banners (reuse)
  // ==========================================
  const fetchBanners = async () => {
    try {
      const res = await axios.get("banners/");
      setBanners(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ==========================================
  // Form Handlers
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({});
    setPreview(null);
    setShowModal(true);
  };

  // ==========================================
  // Save Banner (Add or Edit)
  // ==========================================
  const handleSave = async () => {
    const data = new FormData();
    data.append("title", formData.title || "");
    data.append("subtitle", formData.subtitle || "");
    data.append("order", formData.order || 0);
    data.append("active", formData.active ? "true" : "false");

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (editingBanner) {
        // Update
        await axios.put(`banners/${editingBanner.id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create
        await axios.post("banners/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchBanners();
      setShowModal(false);
      alert("✅ Banner saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Could not save banner.");
    }
  };

  // ==========================================
  // Edit & Delete
  // ==========================================
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData(banner);

    // Ensure full URL for preview
    setPreview(
      banner.image.startsWith("http")
        ? banner.image
        : `${backendBase}${banner.image}`
    );

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;

    try {
      await axios.delete(`banners/${id}/`);
      fetchBanners();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="banner-container">
      <h2>🖼️ Manage Home Banners</h2>

      <div className="banner-toolbar">
        <button className="add-btn" onClick={openAddModal}>
          ➕ Add New Banner
        </button>
      </div>

      {/* Banner list */}
      <div className="banner-grid">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-card">
            <img
              src={
                banner.image.startsWith("http")
                  ? banner.image
                  : `${backendBase}${banner.image}`
              }
              alt={banner.title}
            />

            <div className="banner-info">
              <h4>{banner.title || "Untitled Banner"}</h4>
              <p>{banner.subtitle}</p>

              <div className="meta">
                <span>Order: {banner.order}</span> •{" "}
                <span className={banner.active ? "active" : "inactive"}>
                  {banner.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="actions">
                <button onClick={() => handleEdit(banner)}>✏️ Edit</button>
                <button
                  className="delete"
                  onClick={() => handleDelete(banner.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingBanner ? "Edit Banner" : "Add New Banner"}</h3>

            <div className="modal-form">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
              />

              <label>Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle || ""}
                onChange={handleChange}
              />

              <label>Order</label>
              <input
                type="number"
                name="order"
                value={formData.order || 0}
                onChange={handleChange}
              />

              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={!!formData.active}
                  onChange={handleChange}
                />{" "}
                Active
              </label>

              <label>Image</label>
              <input type="file" onChange={handleFileChange} />

              {preview && (
                <img src={preview} alt="Preview" className="preview-img" />
              )}

              <div className="modal-actions">
                <button className="save-btn" onClick={handleSave}>💾 Save</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>✖ Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
