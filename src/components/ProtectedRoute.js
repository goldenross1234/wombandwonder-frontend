// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED IMPORT

/**
 * ✅ ProtectedRoute
 * - Checks JWT validity (expiration)
 * - Redirects to login if expired or missing
 * - Supports optional role-based access
 *
 * Usage:
 * <ProtectedRoute roles={["superuser", "owner"]}><Dashboard /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const accessToken = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // ⏳ Auto logout if JWT expired
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken); // ✅ FIXED FUNCTION NAME
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          console.warn("⚠️ Token expired. Logging out...");
          localStorage.clear();
          window.location.href = "/admin-panel/login";
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.clear();
        window.location.href = "/admin-panel/login";
      }
    }
  }, [accessToken]);

  // 🧱 No token → redirect to login
  if (!accessToken) {
    return <Navigate to="/admin-panel/login" state={{ from: location }} replace />;
  }

  // 🧩 Role restriction
  if (roles.length > 0 && !roles.includes(role)) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "#4a0e33" }}>
        <h1>🚫 Access Denied</h1>
        <p>You don’t have permission to view this page.</p>
        <a href="/admin-panel" style={{ color: "var(--brand-pink)" }}>
          Go back to Dashboard
        </a>
      </div>
    );
  }

  return children;
}
