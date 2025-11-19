// src/components/LoginModal.js
import React, { useState } from "react";
import axios from "../api/axiosConfig";          // ✔ global axios instance (uses runtime config)
import { loadConfig } from "../config/runtimeConfig"; // ✔ ensures config loaded

// Local uploaded logo path (tool/process will transform to a served url)
const UPLOADED_LOGO_PATH = "/flower.jpg";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Loading UI states
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // used for subtle bar animation

  if (!isOpen) return null;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setProgress(6); // kick off initial progress

    try {
      // Ensure runtime config loaded (axiosConfig depends on it)
      await loadConfig();

      const start = Date.now();

      // API call - relative path to axiosConfig base
      const resPromise = axios.post("auth/login/", {
        username,
        password,
      });

      // animate progress while request is running
      const progressInterval = setInterval(() => {
        setProgress((p) => {
          // increment but never reach 100% yet (reserve for final)
          const next = Math.min(88, p + Math.random() * 8);
          return Math.round(next);
        });
      }, 300);

      const res = await resPromise;

      // ensure min 5 seconds total
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 5000 - elapsed);

      // smooth final progress to 100% over remaining time
      const steps = Math.max(6, Math.round(remaining / 100));
      for (let i = 0; i < steps; i++) {
        await sleep(Math.ceil(remaining / steps));
        setProgress((prev) => Math.min(100, prev + Math.ceil((100 - prev) / (steps - i || 1))));
      }

      clearInterval(progressInterval);
      setProgress(100);

      // small pause so user sees 100%
      await sleep(300);

      const { access, refresh, role, username: user } = res.data || {};

      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      if (role) localStorage.setItem("role", role);
      if (user) localStorage.setItem("username", user);

      onLoginSuccess(role);
      // reset states
      setLoading(false);
      setProgress(0);
      setUsername("");
      setPassword("");
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.error ||
          "Invalid credentials. Please try again."
      );

      // animate to a visible fail state then hide loader
      setProgress(100);
      await sleep(800);
      setLoading(false);
      setProgress(0);
    }
  };

  // Fullscreen branding overlay while loading
  const LoadingOverlay = () => (
    <div style={styles.overlay}>
      <div style={styles.overlayInner}>
        {/* Logo */}
        <img
          src={UPLOADED_LOGO_PATH}
          alt="Womb & Wonder"
          style={styles.logo}
        />

        <h2 style={styles.greeting}>
          Good day, <span style={{ fontWeight: 700 }}>{username || "Guest"}</span>!
        </h2>

        <p style={styles.loadingText}>Please wait while we log you in…</p>

        {/* Swirl loader */}
        <div style={styles.swirlWrapper}>
          <div style={styles.swirl} />
        </div>

        {/* thin progress bar */}
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.35)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: 12,
            width: 420,
            textAlign: "center",
            boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
            position: "relative",
          }}
        >
          <h2 style={{ marginBottom: 12, color: "#b83280" }}>
            Login to Womb & Wonder
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                disabled={loading}
              />
            </div>

            {error && (
              <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
            )}

            <button
              type="submit"
              style={{
                ...styles.primaryBtn,
                opacity: loading ? 0.85 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          <button
            onClick={() => {
              if (!loading) {
                setUsername("");
                setPassword("");
                setError("");
                onClose();
              }
            }}
            style={styles.cancelBtn}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Fullscreen branded loader */}
      {loading && <LoadingOverlay />}
    </>
  );
}

/* -------------------------
   Styles (inline) — easy to move to CSS if desired
   ------------------------- */
const styles = {
  input: {
    width: "100%",
    padding: "0.6rem",
    borderRadius: 8,
    border: "1px solid #e6d7df",
    outline: "none",
  },
  primaryBtn: {
    marginTop: 8,
    width: "100%",
    padding: "0.65rem",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#b83280",
    color: "white",
    fontWeight: 600,
  },
  cancelBtn: {
    marginTop: 10,
    background: "none",
    border: "none",
    color: "#777",
    cursor: "pointer",
  },

  /* Overlay */
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #fff1f6 0%, #ffdbea 40%, #ffd3e8 100%)",
  },
  overlayInner: {
    width: "min(820px, 92%)",
    maxWidth: 900,
    padding: "3rem",
    borderRadius: 20,
    textAlign: "center",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.6))",
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
  },
  logo: {
    width: 110,
    height: "auto",
    objectFit: "contain",
    marginBottom: 14,
    borderRadius: 8,
    background: "white",
    padding: 8,
  },
  greeting: {
    color: "#4a0e33",
    margin: "6px 0 0",
    fontSize: 22,
  },
  loadingText: {
    color: "#6b2350",
    marginTop: 6,
    marginBottom: 18,
    opacity: 0.95,
  },

  /* swirl */
  swirlWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 18,
  },
  swirl: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background:
      "conic-gradient(from 90deg, rgba(184,50,128,0.95), rgba(255,183,197,0.9), rgba(255,255,255,0.25))",
    position: "relative",
    animation: "spin 1.2s linear infinite",
    boxShadow: "0 6px 18px rgba(184,50,128,0.18)",
  },

  /* progress bar */
  progressBarContainer: {
    width: "70%",
    height: 8,
    background: "rgba(255,255,255,0.4)",
    margin: "0 auto",
    borderRadius: 999,
    overflow: "hidden",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
  },
  progressBar: {
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(184,50,128,1), rgba(255,126,178,1))",
    width: "6%",
    transition: "width 220ms linear",
  },
};

/* Keyframes injection for spin animation — this will be appended to document head */
(function injectKeyframes() {
  if (typeof document === "undefined") return;
  const id = "login-modal-keyframes";
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg) scale(1); filter: hue-rotate(0deg); }
      50% { transform: rotate(180deg) scale(1.03); filter: hue-rotate(30deg); }
      100% { transform: rotate(360deg) scale(1); filter: hue-rotate(0deg); }
    }
  `;
  document.head.appendChild(style);
})();
