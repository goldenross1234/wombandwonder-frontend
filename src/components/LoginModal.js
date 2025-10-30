import React, { useState } from "react";
import axios from "axios";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null; // Don’t render if modal is closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username,
        password,
      });

      const { access, refresh, role, username: user } = res.data;

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", role);
      localStorage.setItem("username", user);

      onLoginSuccess(role); // pass role back to Navbar
      onClose();
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#b83280" }}>Login to Womb & Wonder</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

          <button
            type="submit"
            style={{
              backgroundColor: "#b83280",
              color: "white",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Log In
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            background: "none",
            border: "none",
            color: "#777",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
