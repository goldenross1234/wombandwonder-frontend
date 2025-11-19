import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";             
import { loadConfig } from "../../config/runtimeConfig";
import "./HeroManager.css";

export default function HeroManager() {
  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

  // ============================================================
  // LOAD CONFIG + HERO DATA
  // ============================================================
  useEffect(() => {
    async function init() {
      try {
        const cfg = await loadConfig();
        const backendBase = cfg.backend_url.replace("/api", "");

        const res = await axios.get("hero/");
        if (res.data.length > 0) {
          const h = res.data[0];
          setHero(h);
          setFormData(h);

          // Full image URL for preview
          if (h.image) {
            setPreview(
              h.image.startsWith("http")
                ? h.image
                : `${backendBase}${h.image}`
            );
          }
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      }
    }
    init();
  }, []);

  // ============================================================
  // INPUT HANDLERS
  // ============================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file)); 
    }
  };

  // ============================================================
  // SAVE HERO SECTION
  // ============================================================
  const handleSave = async () => {
    if (!hero) return;

    const data = new FormData();

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    data.append("title", formData.title || "");
    data.append("subtitle", formData.subtitle || "");
    data.append("button_text", formData.button_text || "");
    data.append("active", formData.active ? "true" : "false");

    try {
      await axios.put(`hero/${hero.id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Hero Section updated successfully!");
    } catch (err) {
      console.error("Error updating hero section:", err);
      alert("❌ Failed to update hero section.");
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (!hero) return <p className="loading">Loading Hero Section...</p>;

  return (
    <div className="hero-manager">
      <h2>💖 Edit Hero Section</h2>

      <div className="hero-form">

        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Subtitle:</label>
          <textarea
            name="subtitle"
            value={formData.subtitle || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Button Text:</label>
          <input
            type="text"
            name="button_text"
            value={formData.button_text || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={!!formData.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}

        <div className="button-row">
          <button className="save-btn" onClick={handleSave}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
