import React, { useEffect, useState } from "react";
import axios from "axios";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "framer-motion";
import "./BlogManager.css";

const API_URL = "http://127.0.0.1:8000/api";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    title: "",
    content: "",
    video_url: "",
    published: false,
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_URL}/blogs/`, { headers });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const resetForm = () => {
    setEditing(false);
    setForm({
      id: null,
      title: "",
      content: "",
      video_url: "",
      published: false,
    });
    setFile(null);
  };

  const handleSave = async (publish = false) => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("published", publish);
      if (form.video_url) formData.append("video_url", form.video_url);
      if (file) formData.append("cover_image", file);

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (form.id) {
        await axios.put(`${API_URL}/blogs/${form.id}/`, formData, { headers });
        setMessage("✅ Blog updated successfully!");
      } else {
        await axios.post(`${API_URL}/blogs/`, formData, { headers });
        setMessage(publish ? "✅ Blog published!" : "✅ Draft saved!");
      }

      fetchBlogs();
      resetForm();
    } catch (err) {
      console.error("Error saving blog:", err);
      setMessage("❌ Failed to save blog. Check fields and try again.");
    }
  };

  const handleEdit = (blog) => {
    setForm(blog);
    setEditing(true);
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`${API_URL}/blogs/${id}/`, { headers });
      setMessage("🗑️ Blog deleted.");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      setMessage("❌ Failed to delete blog.");
    }
  };

  return (
    <div className="blog-admin-page">
      <h1 className="page-title">💗 Manage Blog Posts</h1>

      {message && <div className="status-message">{message}</div>}

      {!editing ? (
        <>
          <button className="add-post-btn" onClick={() => setEditing(true)}>
            ➕ Add New Post
          </button>

          <div className="blog-list">
            {blogs.length === 0 ? (
              <p>No blog posts yet.</p>
            ) : (
              blogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {blog.cover_image && (
                    <img
                      src={
                        blog.cover_image.startsWith("http")
                          ? blog.cover_image
                          : `http://127.0.0.1:8000${blog.cover_image}`
                      }
                      alt={blog.title}
                      className="blog-cover"
                    />
                  )}
                  <h3>{blog.title}</h3>
                  <p className="blog-snippet">
                    {blog.content.slice(0, 100)}...
                  </p>
                  <p className="status-tag">
                    {blog.published ? "✅ Published" : "📝 Draft"}
                  </p>
                  <div className="blog-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(blog)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(blog.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      ) : (
        <motion.div
          className="blog-form-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button className="back-btn" onClick={resetForm}>
            ← Back to Blogs
          </button>

          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Blog Title"
            className="title-input"
          />

          <label className="editor-label">Content</label>
          <div className="editor-container" data-color-mode="light">
            <MDEditor
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              height={400} // larger editor
              preview="edit"
              style={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}
            />
          </div>

          <div className="blog-meta">
            <input
              type="text"
              placeholder="YouTube / Video URL (optional)"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="video-input"
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="file-input"
            />
          </div>

          {form.cover_image && (
            <div className="cover-preview-wrapper">
              <img
                src={
                  form.cover_image.startsWith("http")
                    ? form.cover_image
                    : `http://127.0.0.1:8000${form.cover_image}`
                }
                alt="Cover Preview"
                className="cover-preview"
              />
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={() => handleSave(false)}
              className="draft-btn"
              type="button"
            >
              💾 Save as Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              className="publish-btn"
              type="button"
            >
              🚀 Publish Now
            </button>
          </div>
        </motion.div>

      )}
    </div>
  );
}
