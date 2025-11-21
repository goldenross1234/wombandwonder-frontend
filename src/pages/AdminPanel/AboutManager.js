import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { loadConfig } from "../../config/runtimeConfig";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import "./AboutManager.css";

// 🔥 DND KIT IMPORTS
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// 🔥 Component that makes each section draggable
function SortableSection({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function AboutManager() {
  const [about, setAbout] = useState(null);
  const [file, setFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [backendBase, setBackendBase] = useState("");

  // ============================================================
  // LOAD CONFIG + ABOUT PAGE
  // ============================================================
  useEffect(() => {
    async function fetchData() {
      try {
        const config = await loadConfig();
        setBackendBase(config.backend_url.replace("/api", ""));

        const res = await axios.get("about/");
        const data = res.data[0] || {};

        setAbout(data);
        setSections(data.sections || []);
      } catch (err) {
        console.error("Error fetching about:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ============================================================
  // SAVE MAIN ABOUT PAGE
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!about?.id) return alert("⚠️ No About page found.");

    const formData = new FormData();
    formData.append("title", about.title);
    formData.append("content", about.content);
    if (file) formData.append("image", file);

    try {
      await axios.put(`about/${about.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ About page updated successfully!");
      setFile(null);
    } catch (err) {
      console.error("Error updating About page:", err);
      setMessage("❌ Failed to update About page.");
    }
  };

  // ============================================================
  // ADD NEW SECTION
  // ============================================================
  const addSection = () => {
    setSections([
      ...sections,
      { title: "", content: "", image: null, active: true, isNew: true, order: sections.length },
    ]);
  };

  // ============================================================
  // UPDATE SECTION TEXT (title & content)
  // ============================================================
  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  // ============================================================
  // UPDATE SECTION IMAGE/VIDEO
  // ============================================================
  const handleSectionImage = (index, file) => {
    const updated = [...sections];
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    setSections(updated);
  };


  // ============================================================
  // DRAG & DROP — REORDER SECTIONS
  // ============================================================
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    const updated = [...sections];
    const [moved] = updated.splice(oldIndex, 1);
    updated.splice(newIndex, 0, moved);

    // update order indexes
    const reordered = updated.map((sec, i) => ({ ...sec, order: i }));

    setSections(reordered);
  };

  // ============================================================
  // SAVE ALL SECTIONS
  // ============================================================
  const handleSaveSections = async () => {
    try {
      for (const sec of sections) {
        const formData = new FormData();
        formData.append("title", sec.title);
        formData.append("content", sec.content);
        formData.append("active", sec.active);
        formData.append("about_page", about.id);
        formData.append("order", sec.order);

        if (sec.imageFile) {
          formData.append("image", sec.imageFile);
        }

        if (sec.id) {
          await axios.put(`sections/${sec.id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await axios.post(`sections/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      setMessage("✅ All sections saved successfully!");
    } catch (err) {
      console.error("Error saving sections:", err);
      setMessage("❌ Failed to save some sections.");
    }
  };

  // ============================================================
  // DELETE SECTION
  // ============================================================
  const removeSection = async (index) => {
    const section = sections[index];
    if (!window.confirm("Delete this section?")) return;

    setSections((prev) => prev.filter((_, i) => i !== index));

    if (section.id) {
      try {
        await axios.delete(`sections/${section.id}/`);
      } catch (err) {
        console.error("Error deleting section:", err);
      }
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  if (loading) return <p>Loading...</p>;

  return (
    <div className="about-admin-page">
      <h1 className="page-title">💗 Edit About Page</h1>

      {message && <div className="status-message">{message}</div>}

      {about ? (
        <>
          {/* ================= MAIN FORM ================= */}
          <form onSubmit={handleSubmit} className="about-form">
            <label>Title</label>
            <input
              type="text"
              value={about.title || ""}
              onChange={(e) => setAbout({ ...about, title: e.target.value })}
            />

            {/* TEXT EDITOR */}
            <div className="editor-container">
              <div className="editor-pane">
                <label>Content</label>
                <textarea
                  rows="10"
                  value={about.content || ""}
                  onChange={(e) =>
                    setAbout({ ...about, content: e.target.value })
                  }
                />
              </div>

              <div className="preview-pane">
                <label>Live Preview</label>
                <div className="preview-box">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {about.content || "*Start typing...*"}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* MAIN IMAGE */}
            <label>Image</label>
            {about.image && (
              <img
                src={
                  about.image.startsWith("http")
                    ? about.image
                    : `${backendBase}${about.image}`
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

          {/* ================= SECTIONS ================= */}
          <h2 className="section-title">🌸 About Sections</h2>

          {/* 🔥 Drag + Drop Context */}
          <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((sec, index) => (
                <SortableSection key={sec.id} id={sec.id}>
                  <motion.div
                    className="about-section-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                      value={sec.title || ""}
                      onChange={(e) =>
                        handleSectionChange(index, "title", e.target.value)
                      }
                    />

                    <div className="section-markdown">
                      <textarea
                        rows="6"
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

                    {/* MEDIA DISPLAY */}
                    <label>Section Media</label>
                    {(() => {
                      const isVideo = sec.image && sec.image.match(/\.(mp4|mov|webm)$/i);

                      const imageUrl = sec.imagePreview
                        ? sec.imagePreview
                        : sec.image?.startsWith("http")
                        ? sec.image
                        : sec.image
                        ? `${backendBase}/${sec.image.replace(/^\//, "")}`
                        : null;

                      return isVideo ? (
                        <video controls className="section-image-preview">
                          <source src={imageUrl} type="video/mp4" />
                        </video>
                      ) : imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={sec.title}
                          className="section-image-preview"
                        />
                      ) : (
                        <div className="image-placeholder">No Media Selected</div>
                      );
                    })()}

                    <input
                      type="file"
                      onChange={(e) =>
                        handleSectionImage(index, e.target.files[0])
                      }
                    />
                  </motion.div>
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>

          <div className="section-actions">
            <button onClick={addSection} className="add-section-btn">
              + Add New Section
            </button>
            <button onClick={handleSaveSections} className="save-btn">
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
