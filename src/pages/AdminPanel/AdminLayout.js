import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Image,
  Heart,
  MapPin,
  Gift,
  FileText,
  BookOpen,
  Users,
  LogOut,
  Home,
  Briefcase,
  Folder,
  Monitor, // 🩺 Replacing Stethoscope to avoid missing icon issues
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./AdminLayout.css";

export default function AdminLayout() {
  const role = localStorage.getItem("role") || "staff"; // fallback so roles always work
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ✅ Sidebar Navigation (with Queue Manager and Add Patient)
  const navItems = [
    { path: "/admin-panel/profile", label: "My Profile", icon: <User size={16} /> },
    { path: "/admin-panel", label: "Dashboard", icon: <LayoutDashboard size={16} /> },

    // 🧑‍⚕️ Queue Management Section
    { path: "/admin-panel/queue", label: "Queue Manager", icon: <Users size={16} /> },
    //{ path: "/admin-panel/queue-add", label: "Add Patient", icon: <User size={16} /> },
    { path: "/admin-panel/queue-display", label: "Queue Display", icon: <Monitor size={16} /> },

    { path: "/admin-panel/hero", label: "Hero Section", icon: <Heart size={16} /> },
    { path: "/admin-panel/banners", label: "Banners", icon: <Image size={16} /> },
    {
      path: "/admin-panel/services",
      label: "Services",
      icon: <Briefcase size={16} />,
      roles: ["staff", "supervisor", "owner", "superuser"], // ✅ visible to all staff+
    },
    { path: "/admin-panel/categories", label: "Categories", icon: <Folder size={16} /> },
    { path: "/admin-panel/locations", label: "Locations", icon: <MapPin size={16} /> },
    { path: "/admin-panel/promos", label: "Promos", icon: <Gift size={16} /> },
    { path: "/admin-panel/about", label: "About", icon: <FileText size={16} /> },
    { path: "/admin-panel/blog", label: "Blog", icon: <BookOpen size={16} /> },
    {
      path: "/admin-panel/users",
      label: "Manage Users",
      icon: <Users size={16} />,
      roles: ["superuser", "owner", "supervisor"], // restricted
    },
  ];

  return (
    <>
      {/* 🌸 Shared Navbar */}
      <Navbar />

      <div className="admin-layout">
        {/* 🩷 Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h1>Womb & Wonder</h1>
            <p>Admin Panel</p>
          </div>

          {/* 📋 Sidebar Navigation */}
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              if (item.roles && !item.roles.includes(role)) return null;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  {item.icon && <span className="icon">{item.icon}</span>}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 🌐 Back to Website */}
          <div className="sidebar-extra">
            <Link to="/" className="back-home-link">
              <Home size={16} /> Back to Website
            </Link>
          </div>

          {/* 🚪 Logout */}
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* 🩵 Main Admin Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {/* 🌷 Shared Footer */}
      <Footer />
    </>
  );
}
