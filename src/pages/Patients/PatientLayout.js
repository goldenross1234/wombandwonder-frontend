// src/pages/Patients/PatientLayout.js
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function PatientLayout() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Patient";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/patients-corner/login");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <nav
        style={{
          background: "#f8f3f7",
          padding: "1rem 2rem",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#e91e63" }}>Patients Corner</h2>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <Link to="/patients-corner" className="nav-link">
            Dashboard
          </Link>
          <Link to="/patients-corner/appointments" className="nav-link">
            Appointments
          </Link>
          <Link to="/patients-corner/notifications" className="nav-link">
            Notifications
          </Link>
          <Link to="/patients-corner/profile" className="nav-link">
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: "#e91e63",
              color: "white",
              border: "none",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
