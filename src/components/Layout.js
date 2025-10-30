// src/components/Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin-panel");
  const role = localStorage.getItem("role");

  /**
   * 🧠 Logic:
   * - Hide Navbar/Footer on admin pages
   * - Always show them for public routes
   * - If staff logged in, still show navbar/footer (so they can browse site)
   */
  const shouldShowLayout =
    !isAdminRoute || (isAdminRoute && role === "staff");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fffafc",
      }}
    >
      {shouldShowLayout && <Navbar />}
      <main style={{ flex: 1 }}>{children}</main>
      {shouldShowLayout && <Footer />}
    </div>
  );
}
