import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";            // ✔ use global axios
import { loadConfig } from "../config/runtimeConfig"; // ✔ dynamic backend
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Blog.css";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendBase, setBackendBase] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const cfg = await loadConfig();
        const base = cfg.backend_url.replace("/api", "");
        setBackendBase(base);

        const res = await axios.get("blogs/");
        const published = res.data.filter((b) => b.published === true);
        setBlogs(published);
      } catch (err) {
        console.error("Error loading blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading)
    return (
      <div className="blog-loading">
        Loading Womb & Wonder blogs...
      </div>
    );

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-title">🌸 Womb & Wonder Blog</h1>
        <p className="blog-subtitle">
          Stories, insights, and wellness tips for every woman.
        </p>

        {blogs.length === 0 ? (
          <p className="no-blogs">No blogs have been published yet. Check back soon!</p>
        ) : (
          <div className="blog-grid">
            {blogs.map((blog, index) => {
              const imageUrl = blog.cover_image
                ? blog.cover_image.startsWith("http")
                  ? blog.cover_image
                  : `${backendBase}${blog.cover_image}`
                : "/placeholder-about.jpg";

              return (
                <motion.div
                  key={blog.id}
                  className="blog-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="blog-image-wrapper">
                    <img
                      src={imageUrl}
                      alt={blog.title}
                      className="blog-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-about.jpg";
                      }}
                    />
                  </div>

                  <div className="blog-content">
                    <h2 className="blog-card-title">{blog.title}</h2>
                    <p className="blog-snippet">
                      {blog.content.slice(0, 120)}...
                    </p>

                    <div className="blog-footer">
                      <Link to={`/blog/${blog.slug}`} className="blog-readmore">
                        Read More →
                      </Link>

                      <span className="blog-date">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
