import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function Services() {
  const { category } = useParams(); // 👈 dynamic category slug (e.g. /services/consultations)
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/services/"),
          axios.get("http://127.0.0.1:8000/api/service-categories/"),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching services or categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧠 Category-based filter
  const filteredServices = category
    ? services.filter((s) => {
        const catName = s.category_name || s.category?.name || "";
        return (
          catName.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase()
        );
      })
    : services;

  // 🩷 Find category display name for title
  const activeCategory = categories.find(
    (c) => c.name.toLowerCase().replace(/\s+/g, "-") === category
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p>Loading services...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "3rem 2rem",
        maxWidth: "1100px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      {/* 🩷 Page Title */}
      <h1 style={{ color: "var(--brand-pink)", fontSize: "2rem", marginBottom: "1rem" }}>
        {category
          ? `${activeCategory?.name || category.replace("-", " ")} Services`
          : "Our Services"}
      </h1>

      {/* 🩶 Subtitle */}
      <p style={{ color: "#666", marginBottom: "2rem" }}>
        {category
          ? `Explore services under ${activeCategory?.name || category}.`
          : "Discover our full range of healthcare and wellness services."}
      </p>

      {/* 🧭 Category Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          to="/services"
          className="category-btn"
          style={{
            backgroundColor: !category ? "var(--brand-pink)" : "#eee",
            color: !category ? "white" : "#333",
            padding: "0.5rem 1.2rem",
            borderRadius: "25px",
            textDecoration: "none",
            transition: "0.3s",
          }}
        >
          All
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/services/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="category-btn"
            style={{
              backgroundColor:
                category === cat.name.toLowerCase().replace(/\s+/g, "-")
                  ? "var(--brand-pink)"
                  : "#eee",
              color:
                category === cat.name.toLowerCase().replace(/\s+/g, "-")
                  ? "white"
                  : "#333",
              padding: "0.5rem 1.2rem",
              borderRadius: "25px",
              textDecoration: "none",
              transition: "0.3s",
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* 🩷 Service Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service.id}
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                textAlign: "left",
                border: "1px solid #f3d1e1",
              }}
            >
              <h3
                style={{
                  color: "var(--brand-pink)",
                  marginBottom: "0.5rem",
                  fontSize: "1.2rem",
                }}
              >
                {service.name}
              </h3>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#555",
                  marginBottom: "0.5rem",
                }}
              >
                {service.description}
              </p>
              <p style={{ fontWeight: "600", color: "#4a0e33" }}>
                ₱{Number(service.price).toLocaleString()}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#777",
                }}
              >
                Category:{" "}
                {service.category_name || service.category?.name || "Uncategorized"}
              </span>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: "1 / -1", color: "#777" }}>
            No services found for this category.
          </p>
        )}
      </div>
    </div>
  );
}
