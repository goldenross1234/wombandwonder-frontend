import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import axios from "axios";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [categories, setCategories] = useState([]); // 🩷 dynamic service categories

  // 🔁 Track login state across tabs / reloads
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("access"));
      setUsername(localStorage.getItem("username") || "");
      setRole(localStorage.getItem("role") || "");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 🩷 Fetch service categories dynamically
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/service-categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  // 🧠 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ After successful login
  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setUsername(localStorage.getItem("username"));
    setRole(userRole);

    // Redirect logic
    if (["superuser", "owner", "supervisor"].includes(userRole)) {
      navigate("/admin-panel");
    } else {
      navigate("/"); // staff stays on homepage
    }
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
        {/* 🌸 Left: Logo */}
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

        {/* 📜 Center: Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
          <Link to="/blog" className="nav-link">
            Blog
          </Link>

          {/* 🩷 Dynamic Services Dropdown */}
          <div className="dropdown">
            <button className="dropbtn">Services ▾</button>
            <div className="dropdown-content">
              {categories.length > 0 ? (
                categories
                  .filter((cat) => cat.active)
                  .map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/services/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {cat.name}
                    </Link>
                  ))
              ) : (
                <span style={{ padding: "0.5rem 1rem", color: "#999" }}>
                  No categories
                </span>
              )}
            </div>
          </div>

          <Link to="/business" className="nav-link">
            Business
          </Link>
          <Link to="/locations" className="nav-link">
            Locations
          </Link>
          <Link to="/promos" className="nav-link">
            Promos
          </Link>
        </div>

        {/* 🛍️ Right: Search + Icons */}
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

          {/* 👤 User Icon */}
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <FaUser
              size={18}
              color="#4a0e33"
              style={{ cursor: "pointer", transition: "0.2s" }}
              title={isLoggedIn ? "Account Menu" : "Login"}
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  setShowDropdown(!showDropdown);
                }
              }}
            />

            {/* 🔽 Dropdown Menu */}
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

      {/* 🩷 Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Navbar;
