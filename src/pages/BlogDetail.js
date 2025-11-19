import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosConfig";              // ✔ use global axios
import { loadConfig } from "../config/runtimeConfig"; // ✔ dynamic backend config
import MDEditor from "@uiw/react-md-editor";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendBase, setBackendBase] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const cfg = await loadConfig();
        const base = cfg.backend_url.replace("/api", "");
        setBackendBase(base);

        // Fetch list (your backend doesn't have blogs/<slug>/ endpoint)
        const res = await axios.get("blogs/");
        const post = res.data.find((b) => b.slug === slug);

        setBlog(post || null);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading blog post...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-pink-50 text-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Blog post not found 😢</h2>
        <Link to="/blog" className="text-pink-600 font-medium hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  // Resolve cover image
  const banner = blog.cover_image
    ? blog.cover_image.startsWith("http")
      ? blog.cover_image
      : `${backendBase}${blog.cover_image}`
    : null;

  return (
    <div className="bg-pink-50 min-h-screen pb-20">
      {/* Banner */}
      {banner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-72 md:h-96 overflow-hidden"
        >
          <img
            src={banner}
            alt={blog.title}
            className="object-cover w-full h-full"
          />
        </motion.div>
      )}

      {/* Article Container */}
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-sm py-10 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <h1 className="text-3xl font-bold text-pink-700 mb-2">
            {blog.title}
          </h1>
          <div className="text-gray-500 text-sm mb-6">
            Published on {new Date(blog.created_at).toLocaleDateString()}
            {blog.author && ` • by ${blog.author}`}
          </div>

          {/* Markdown Content */}
          <div data-color-mode="light" className="mb-6">
            <MDEditor.Markdown
              source={blog.content || ""}
              className="prose prose-pink max-w-none"
            />
          </div>

          {/* Optional Video */}
          {blog.video_url && (
            <div className="my-6 flex justify-center">
              <iframe
                width="100%"
                height="400"
                src={blog.video_url.replace("watch?v=", "embed/")}
                title="Blog Video"
                className="rounded-xl shadow-md"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-10 text-center">
            <Link
              to="/blog"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              ← Back to Blog
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
