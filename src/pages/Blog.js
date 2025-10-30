import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Blog.css"; // 👈 make sure to include this

const API_URL = "http://127.0.0.1:8000/api";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/blogs/`)
      .then((res) => {
        const published = res.data.filter((b) => b.published === true);
        setBlogs(published);
      })
      .catch((err) => console.error("Error loading blogs:", err))
      .finally(() => setLoading(false));
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
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                className="blog-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="blog-image-wrapper">
                  <img
                    src={
                      blog.cover_image
                        ? blog.cover_image.startsWith("http")
                          ? blog.cover_image
                          : `http://127.0.0.1:8000${blog.cover_image}`
                        : "/placeholder-about.jpg"
                    }
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
