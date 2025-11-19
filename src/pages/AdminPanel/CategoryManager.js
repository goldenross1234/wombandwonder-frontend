import React, { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import { loadConfig } from "../../config/runtimeConfig";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // ============================================================
  // LOAD CONFIG + CATEGORIES
  // ============================================================
  useEffect(() => {
    async function init() {
      try {
        await loadConfig();  // Load config but no need to store backendBase here
        fetchCategories();
      } catch (err) {
        console.error("Config load error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);


  // ============================================================
  // FETCH CATEGORIES
  // ============================================================
  const fetchCategories = async () => {
    try {
      const res = await axios.get("service-categories/"); // no hardcoded URL
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ============================================================
  // SAVE CATEGORY
  // ============================================================
  const handleSave = async () => {
    try {
      if (editingCategory) {
        await axios.put(`service-categories/${editingCategory.id}/`, formData);
      } else {
        await axios.post("service-categories/", formData);
      }

      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err.response?.data || err);
      alert("❌ Failed to save category. Please check the form.");
    }
  };

  // ============================================================
  // DELETE CATEGORY
  // ============================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`service-categories/${id}/`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // ============================================================
  // OPEN MODAL
  // ============================================================
  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="admin-page">
      <h2 className="page-title">📂 Manage Service Categories</h2>

      <button className="add-btn" onClick={() => openModal()}>
        <PlusCircle size={18} /> Add Category
      </button>

      <div className="card-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="card">
            <h3>{cat.name}</h3>
            <p>{cat.description || "No description provided."}</p>

            <div className="btn-group">
              <button onClick={() => openModal(cat)} className="edit-btn">
                <Edit size={16} /> Edit
              </button>

              <button
                onClick={() => handleDelete(cat.id)}
                className="delete-btn"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingCategory ? "Edit Category" : "Add Category"}</h3>

            <label>Name:</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <label>Description:</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleSave} className="save-btn">
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .page-title {
          color: #c2185b;
          font-size: 1.8rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        }
        .add-btn {
          background: #c2185b;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.08);
        }
        .btn-group {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .edit-btn, .delete-btn {
          border: none;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .edit-btn { background: #f8bbd0; color: #4a0e33; }
        .delete-btn { background: #fbe9e7; color: #e91e63; }
      `}</style>
    </div>
  );
}
