import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import axios from "../api/axiosConfig";              // ✅ use your global axios
import { loadConfig } from "../config/runtimeConfig"; // ✅ dynamic backend
import LoginModal from "./LoginModal";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [categories, setCategories] = useState([]);

  // Patient info
  const [patientToken, setPatientToken] = useState(localStorage.getItem("patient_access") || null);
  const [patientName, setPatientName] = useState(localStorage.getItem("patient_name") || "");

  // Sync login state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access"));
      setPatientToken(localStorage.getItem("patient_access"));
      setPatientName(localStorage.getItem("patient_name") || "");
      setUsername(localStorage.getItem("username") || "");
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🌸 Fetch service categories with dynamic backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        await loadConfig();              // ensures axiosConfig already has baseURL
        const res = await axios.get("service-categories/");  // ✅ NO HARDCODED URL
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setPatientToken(null);
    navigate("/");
  };

  const handlePatientLogout = () => {
    localStorage.removeItem("patient_access");
    localStorage.removeItem("patient_name");
    navigate("/patient-login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Admin login success
  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setUsername(localStorage.getItem("username"));
    setRole(userRole);
    if (["superuser", "owner", "supervisor"].includes(userRole)) navigate("/admin-panel");
    else navigate("/");
  };

  return (
    <>
      <nav
        style={{
          borderTop: "4px solid var(--brand-pink)",
          backgroundColor: "white",
          padding: "0.75rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--brand-pink)",
            textDecoration: "none",
          }}
        >
          Womb<span style={{ color: "var(--text-dark)" }}>&</span>Wonder
        </Link>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/blog" className="nav-link">Blog</Link>

          {/* Services Dropdown */}
          <div className="dropdown">
            <button className="dropbtn">Services ▾</button>
            <div className="dropdown-content">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories
                  .filter(cat => cat.active)
                  .map(cat => (
                    <Link
                      key={cat.id}
                      to={`/services/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {cat.name}
                    </Link>
                  ))
              ) : (
                <span style={{ padding: "0.5rem 1rem", color: "#999" }}>No categories</span>
              )}
            </div>
          </div>


          <Link to="/business" className="nav-link">Business</Link>
          <Link to="/locations" className="nav-link">Locations</Link>
          <Link to="/promos" className="nav-link">Promos</Link>

          {/* Patient */}
          {!patientToken ? (
            <Link
              to="/patient-login"
              className="nav-link"
              style={{ color: "var(--brand-pink)", fontWeight: "600" }}
            >
              Patients Corner
            </Link>
          ) : (
            <div className="dropdown" style={{ position: "relative" }}>
              <button
                className="dropbtn"
                style={{ color: "var(--brand-pink)", fontWeight: "600" }}
              >
                {patientName || "My Account"} ▾
              </button>
              <div
                className="dropdown-content"
                style={{
                  position: "absolute",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  top: "30px",
                  right: 0,
                  minWidth: "180px",
                  zIndex: 10,
                }}
              >
                <Link to="/patient-dashboard">My Profile</Link>
                <Link to="/patient-appointments">My Appointments</Link>
                <button
                  onClick={handlePatientLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    padding: "8px 12px",
                    color: "#e91e63",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search + Admin */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            position: "relative",
          }}
        >
          <input
            type="text"
            placeholder="Search services..."
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "1px solid #ddd",
              outline: "none",
              width: "180px",
            }}
          />
          <FaShoppingCart size={18} color="#4a0e33" />

          {/* Admin Dropdown */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <FaUser
              size={18}
              color="#4a0e33"
              style={{ cursor: "pointer" }}
              title={isLoggedIn ? "Account Menu" : "Login"}
              onClick={() => {
                if (!isLoggedIn) setShowLoginModal(true);
                else setShowDropdown(!showDropdown);
              }}
            />

            {isLoggedIn && showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  minWidth: "180px",
                  zIndex: 100,
                }}
              >
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #eee",
                    fontSize: "0.9rem",
                    color: "#333",
                  }}
                >
                  {username || "User"} —{" "}
                  <span style={{ color: "#e91e63", fontWeight: "600" }}>
                    {role?.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/admin-panel/profile")}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 1rem",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  My Profile
                </button>

                <button
                  onClick={() => navigate("/admin-panel")}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 1rem",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.6rem 1rem",
                    border: "none",
                    background: "none",
                    color: "#e91e63",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navbar;
