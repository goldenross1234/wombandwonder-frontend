import React, { useState, useEffect, useCallback } from "react";
import axios from "../../api/axiosConfig";          // ✔ global axios with runtime backend
import { loadConfig } from "../../config/runtimeConfig"; // ✔ dynamic backend
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import "./ServiceManager.css";

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    active: true,
  });

  const [errorMessage, setErrorMessage] = useState("");

  // ---------------------------------------------------------
  // LOAD SERVICES & CATEGORIES (wrapped in useCallback)
  // ---------------------------------------------------------
  const fetchData = useCallback(async () => {
    try {
      const [serviceRes, categoryRes] = await Promise.all([
        axios.get("services/"),
        axios.get("service-categories/"),
      ]);

      setServices(serviceRes.data);
      setCategories(categoryRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  useEffect(() => {
    async function init() {
      await loadConfig(); // ensures axiosConfig has correct baseURL
      fetchData();
    }
    init();
  }, [fetchData]);

  // ---------------------------------------------------------
  // SAVE SERVICE
  // ---------------------------------------------------------
  const handleSave = async () => {
    setErrorMessage("");

    if (!formData.name || !formData.price || !formData.category_id) {
      setErrorMessage("⚠️ Please fill all required fields (Name, Price, Category).");
      return;
    }

    try {
      if (editingService) {
        await axios.put(`services/${editingService.id}/`, formData);
      } else {
        await axios.post(`services/`, formData);
      }

      setShowModal(false);
      setEditingService(null);
      fetchData();
    } catch (err) {
      console.error("Error saving service:", err.response?.data || err);
      setErrorMessage("❌ Failed to save service. Please check your input.");
    }
  };

  // ---------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`services/${id}/`);
      fetchData();
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  // ---------------------------------------------------------
  // OPEN MODAL
  // ---------------------------------------------------------
  const openModal = (svc = null) => {
    if (svc) {
      setEditingService(svc);
      setFormData({
        name: svc.name,
        description: svc.description,
        price: svc.price,
        category_id: svc.category?.id || "",
        active: svc.active,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-page">
      <h2 className="page-title">🩺 Manage Services</h2>

      <button className="add-btn" onClick={() => openModal()}>
        <PlusCircle size={18} /> Add Service
      </button>

      <div className="card-grid">
        {services.map((svc) => (
          <div key={svc.id} className="card">
            <h3>{svc.name}</h3>
            <p className="category-tag">{svc.category_name || "No category"}</p>
            <p>{svc.description}</p>
            <p className="price">₱{parseFloat(svc.price).toLocaleString()}</p>

            <div className="btn-group">
              <button onClick={() => openModal(svc)} className="edit-btn">
                <Edit size={16} /> Edit
              </button>

              <button onClick={() => handleDelete(svc.id)} className="delete-btn">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🌸 Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingService ? "✏️ Edit Service" : "➕ Add New Service"}</h3>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter service name"
            />

            <label>Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write a short description..."
            />

            <label>Price (₱) *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
            />

            <label>Category *</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              Active
            </label>

            <div className="modal-actions">
              <button onClick={handleSave} className="save-btn">
                <Save size={16} /> Save
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-btn">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
