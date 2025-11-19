import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { loadConfig } from "../config/runtimeConfig";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

export default function About() {
  const [about, setAbout] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendBase, setBackendBase] = useState("");

  // --------------------------------------------------
  // LOAD CONFIG + ABOUT DATA
  // --------------------------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        const cfg = await loadConfig();
        const base = cfg.backend_url.replace("/api", "");
        setBackendBase(base);

        const res = await axios.get("about/");
        const data = res.data[0];

        setAbout(data);
        setSections(data.sections || []);
      } catch (err) {
        console.error("Error fetching About:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // --------------------------------------------------
  // LOADING UI
  // --------------------------------------------------
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p>Loading About Page...</p>
      </div>
    );

  if (!about)
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p>⚠️ No About Page found.</p>
      </div>
    );

  // dynamic URL for main image
  const mainImageUrl = about.image?.startsWith("http")
    ? about.image
    : `${backendBase}${about.image}`;

  return (
    <div style={{ backgroundColor: "#fff7f9", padding: "4rem 1.5rem" }}>
      {/* 🌸 MAIN ABOUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "3rem" }}
      >
        <h1
          style={{
            color: "#b00055",
            fontSize: "2.4rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {about.title}
        </h1>

        {about.image && (
          <img
            src={mainImageUrl}
            alt={about.title}
            style={{
              maxWidth: "700px",
              width: "100%",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              marginBottom: "1.5rem",
            }}
          />
        )}

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            padding: "2rem",
            textAlign: "left",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {about.content}
          </ReactMarkdown>
        </div>
      </motion.div>

      {/* 🌿 ADDITIONAL SECTIONS */}
      {sections.length > 0 && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "3rem auto 0",
            display: "flex",
            flexDirection: "column",
            gap: "3rem",
          }}
        >
          {sections.map((sec, index) => {
            const isReversed = index % 2 !== 0;

            const sectionImageUrl = sec.image?.startsWith("http")
              ? sec.image
              : `${backendBase}${sec.image}`;

            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{
                  display: "flex",
                  flexDirection: isReversed ? "row-reverse" : "row",
                  alignItems: "center",
                  gap: "2rem",
                  flexWrap: "wrap",
                }}
              >
                {/* IMAGE */}
                {sec.image && (
                  <div style={{ flex: "1 1 400px", textAlign: "center" }}>
                    <img
                      src={sectionImageUrl}
                      alt={sec.title}
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-about.jpg";
                      }}
                    />
                  </div>
                )}

                {/* TEXT */}
                <div
                  style={{
                    flex: "1 1 400px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    padding: "1.5rem 2rem",
                  }}
                >
                  <h2
                    style={{
                      color: "#b00055",
                      marginBottom: "0.8rem",
                      fontSize: "1.6rem",
                    }}
                  >
                    {sec.title}
                  </h2>

                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {sec.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
