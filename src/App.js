import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// 🧑‍💼 Admin Pages
import Login from "./pages/AdminPanel/Login";
import Dashboard from "./pages/AdminPanel/Dashboard";
import HeroManager from "./pages/AdminPanel/HeroManager";
import BannerManager from "./pages/AdminPanel/BannerManager";
import ServiceManager from "./pages/AdminPanel/ServiceManager";
import PromoManager from "./pages/AdminPanel/PromoManager";
import LocationManager from "./pages/AdminPanel/LocationManager";
import AboutManager from "./pages/AdminPanel/AboutManager";
import BlogManager from "./pages/AdminPanel/BlogManager";
import UserManager from "./pages/AdminPanel/UserManager";
import ProfilePage from "./pages/AdminPanel/ProfilePage";
import AdminLayout from "./pages/AdminPanel/AdminLayout";
import CategoryManager from "./pages/AdminPanel/CategoryManager";

// 🌐 Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Services from "./pages/Services";
import Locations from "./pages/Locations";
import Promos from "./pages/Promos";
import Business from "./pages/Business";
import Layout from "./components/Layout";
import PatientLogin from "./pages/PatientLogin";

// 🛑 Optional 404 Page
function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#4a0e33",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "var(--brand-pink)" }}>404</h1>
      <p style={{ fontSize: "1.2rem" }}>Oops! Page not found.</p>
      <a
        href="/"
        style={{
          marginTop: "1rem",
          color: "white",
          backgroundColor: "var(--brand-pink)",
          padding: "0.6rem 1.5rem",
          borderRadius: "25px",
          textDecoration: "none",
          fontWeight: "500",
        }}
      >
        Back to Home
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌸 Public Website */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Layout>
              <BlogDetail />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/services/:category"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/locations"
          element={
            <Layout>
              <Locations />
            </Layout>
          }
        />
        <Route
          path="/promos"
          element={
            <Layout>
              <Promos />
            </Layout>
          }
        />
        <Route
          path="/business"
          element={
            <Layout>
              <Business />
            </Layout>
          }
        />

        {/* 🧍 Patient Login */}
        <Route path="/patient-login" element={<PatientLogin />} />

        {/* 🔐 Admin Login */}
        <Route
          path="/admin-panel/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        {/* 🧭 Protected Admin Panel (Nested Routes) */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="banners" element={<BannerManager />} />
          <Route path="services" element={<ServiceManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="promos" element={<PromoManager />} />
          <Route path="locations" element={<LocationManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={["superuser", "owner", "supervisor", "staff"]}>
                <UserManager />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 🧭 Redirect /admin → /admin-panel */}
        <Route path="/admin" element={<Navigate to="/admin-panel" replace />} />

        {/* 🧩 404 Fallback */}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
