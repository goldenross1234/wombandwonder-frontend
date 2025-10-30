import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HeroManager.css"; // custom stylesheet

export default function HeroManager() {
  const [hero, setHero] = useState(null);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/hero/")
      .then((res) => {
        if (res.data.length > 0) {
          setHero(res.data[0]);
          setFormData(res.data[0]);
          setPreview(res.data[0].image);
        }
      })
      .catch((err) => console.error("Hero fetch error:", err));
  }, []);

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

  const handleSave = async () => {
    if (!hero) return;
    const data = new FormData();

    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("button_text", formData.button_text);
    data.append("active", formData.active);

    try {
      await axios.put(`http://127.0.0.1:8000/api/hero/${hero.id}/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Hero Section updated successfully!");
    } catch (err) {
      console.error("Error updating hero section:", err.response?.data || err);
      alert("❌ Failed to update hero section.");
    }
  };

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
