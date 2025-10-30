import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import "./AboutManager.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function AboutManager() {
  const [about, setAbout] = useState(null);
  const [file, setFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`${API_URL}/about/`)
      .then((res) => {
        const data = res.data[0] || {};
        setAbout(data);
        setSections(data.sections || []);
      })
      .catch((err) => console.error("Error fetching about:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🩷 Save main About page
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!about?.id) return alert("⚠️ No About page found.");

    const formData = new FormData();
    formData.append("title", about.title);
    formData.append("content", about.content);
    if (file) formData.append("image", file);

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      await axios.put(`${API_URL}/about/${about.id}/`, formData, { headers });
      setMessage("✅ About page updated successfully!");
      setFile(null);
    } catch (err) {
      console.error("Error updating About page:", err);
      setMessage("❌ Failed to update About page. Try again.");
    }
  };

  // 🌸 Add new section
  const addSection = () => {
    setSections([
      ...sections,
      { title: "", content: "", image: null, active: true, isNew: true },
    ]);
  };

  // ✍️ Handle text changes
  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  // 🖼️ Handle image upload
  const handleSectionImage = (index, file) => {
    const updated = [...sections];
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setSections(updated);
  };

  // ❌ Delete a section (backend + frontend)
  const removeSection = async (index) => {
    const section = sections[index];

    if (!window.confirm("Are you sure you want to delete this section?")) return;

    // Animate removal from UI
    setSections((prev) => prev.filter((_, i) => i !== index));

    if (section.id) {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await axios.delete(`${API_URL}/sections/${section.id}/`, { headers });
        console.log(`✅ Deleted section ${section.id} from backend`);
        setMessage("🗑️ Section deleted successfully.");
      } catch (err) {
        console.error("Error deleting section:", err);
        setMessage("❌ Failed to delete section from backend.");
      }
    }
  };

  // 💾 Save all sections
  const handleSaveSections = async () => {
    try {
      for (const sec of sections) {
        const formData = new FormData();
        formData.append("title", sec.title);
        formData.append("content", sec.content);
        formData.append("active", sec.active);
        if (sec.imageFile) formData.append("image", sec.imageFile);

        const headers = {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Always include about_page — both for new and existing sections
        formData.append("about_page", about.id);

        if (sec.id) {
          await axios.put(`${API_URL}/sections/${sec.id}/`, formData, { headers });
        } else {
          await axios.post(`${API_URL}/sections/`, formData, { headers });
        }
      }
      setMessage("✅ All sections saved successfully!");
    } catch (err) {
      console.error("Error saving sections:", err);
      setMessage("❌ Failed to save some sections.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="about-admin-page">
      <h1 className="page-title">💗 Edit About Page</h1>

      {message && <div className="status-message">{message}</div>}

      {about ? (
        <>
          {/* ====== MAIN ABOUT FORM ====== */}
          <form onSubmit={handleSubmit} className="about-form">
            <label>Title</label>
            <input
              type="text"
              value={about.title || ""}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
            />

            <div className="editor-container">
              <div className="editor-pane">
                <label>Content (Markdown Supported)</label>
                <textarea
                  rows="10"
                  value={about.content || ""}
                  onChange={(e) =>
                    setAbout({ ...about, content: e.target.value })
                  }
                  placeholder="Write your About content here using Markdown..."
                />
              </div>

              <div className="preview-pane">
                <label>Live Preview</label>
                <div className="preview-box">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {about.content || "*Start typing to see preview...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <label>Image</label>
            {about.image && (
              <img
                src={
                  about.image.startsWith("http")
                    ? about.image
                    : `http://127.0.0.1:8000${about.image}`
                }
                alt="About Preview"
                className="main-image-preview"
              />
            )}
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />

            <button type="submit" className="save-btn">
              Save Main Page
            </button>
          </form>

          {/* ====== SECTIONS ====== */}
          <h2 className="section-title">🌸 About Sections</h2>

          <AnimatePresence>
            {sections.map((sec, index) => (
              <motion.div
                key={sec.id || index}
                className="about-section-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="section-header">
                  <h3>Section {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="remove-section-btn"
                  >
                    ✖ Remove
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Section Title"
                  value={sec.title || ""}
                  onChange={(e) =>
                    handleSectionChange(index, "title", e.target.value)
                  }
                />

                <div className="section-markdown">
                  <textarea
                    rows="6"
                    placeholder="Section Content (Markdown)"
                    value={sec.content || ""}
                    onChange={(e) =>
                      handleSectionChange(index, "content", e.target.value)
                    }
                  />
                  <div className="section-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {sec.content || "*Preview...*"}
                    </ReactMarkdown>
                  </div>
                </div>

                <label>Section Image</label>
                {sec.imagePreview || sec.image ? (
                  <img
                    src={
                      sec.imagePreview
                        ? sec.imagePreview
                        : `http://127.0.0.1:8000${sec.image}`
                    }
                    alt={sec.title}
                    className="section-image-preview"
                  />
                ) : (
                  <div className="image-placeholder">No Image Selected</div>
                )}

                <input
                  type="file"
                  onChange={(e) =>
                    handleSectionImage(index, e.target.files[0])
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="section-actions">
            <button
              type="button"
              onClick={addSection}
              className="add-section-btn"
            >
              + Add New Section
            </button>
            <button
              type="button"
              onClick={handleSaveSections}
              className="save-btn"
            >
              💾 Save All Sections
            </button>
          </div>
        </>
      ) : (
        <p>No About Page data found.</p>
      )}
    </div>
  );
}
