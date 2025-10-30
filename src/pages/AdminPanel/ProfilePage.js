import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // 🔒 Fetch token (from localStorage — adjust if using cookies)
  const token = localStorage.getItem("access_token");

  // =============================
  // 🧩 Step 1 — Fetch profile data
  // =============================
  useEffect(() => {
    console.log("🔍 Access token found:", token);

    if (!token) {
      console.warn("⚠️ No token found in localStorage!");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Profile data fetched:", res.data);
        setProfile(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        console.error("❌ Profile fetch error:", err.response || err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  // =============================
  // ✏️ Handle form changes
  // =============================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =============================
  // 💾 Save profile changes
  // =============================
  const handleSave = () => {
    console.log("💾 Saving profile:", formData);

    axios
      .put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Profile updated:", res.data);
        setProfile(res.data);
        setEditing(false);
        alert("✅ Profile updated successfully!");
      })
      .catch((err) => {
        console.error("❌ Profile update error:", err.response || err.message);
        alert("❌ Failed to update profile. Check console for details.");
      });
  };

  // =============================
  // 🌀 Loading and no data states
  // =============================
  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!profile || Object.keys(profile).length === 0)
    return <p className="text-center mt-10">No profile found.</p>;

  // =============================
  // 🎨 Render form
  // =============================
  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white shadow-md rounded-2xl p-8 border border-pink-100">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">My Profile</h1>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-semibold text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            disabled
            className="border rounded-lg w-full p-2 bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`border rounded-lg w-full p-2 ${
              !editing ? "bg-gray-100" : ""
            }`}
          />
        </div>

        {/* First Name */}
        <div>
          <label className="block font-semibold text-gray-600">
            First Name
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`border rounded-lg w-full p-2 ${
              !editing ? "bg-gray-100" : ""
            }`}
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block font-semibold text-gray-600">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            disabled={!editing}
            className={`border rounded-lg w-full p-2 ${
              !editing ? "bg-gray-100" : ""
            }`}
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-semibold text-gray-600">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role || ""}
            disabled
            className="border rounded-lg w-full p-2 bg-gray-100"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setFormData(profile);
              }}
              className="bg-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
