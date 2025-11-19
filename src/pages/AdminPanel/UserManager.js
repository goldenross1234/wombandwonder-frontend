// src/pages/AdminPanel/UserManager.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "../../api/axiosConfig";    // ✔ global axios
import { loadConfig } from "../../config/runtimeConfig"; // ✔ dynamic backend

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "staff",
    password: "",
  });

  const currentRole = localStorage.getItem("role");

  // ---------------------------------------------------------------
  // Fetch Users (useCallback to satisfy ESLint)
  // ---------------------------------------------------------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------
  // INITIAL LOAD
  // ---------------------------------------------------------------
  useEffect(() => {
    async function init() {
      await loadConfig(); // ensures axios uses the right backend URL
      fetchUsers();
    }
    init();
  }, [fetchUsers]);

  // ---------------------------------------------------------------
  // Input handler
  // ---------------------------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------------------------------------------------------
  // Create or Update User
  // ---------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user
        await axios.put(`users/${editingUser.id}/`, formData);
        alert("✅ User updated successfully!");
      } else {
        // Create new user
        await axios.post("users/", formData);
        alert("✅ User created successfully!");
      }

      // Reset
      setShowForm(false);
      setEditingUser(null);
      setFormData({ username: "", email: "", role: "staff", password: "" });

      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("❌ Failed to save user.");
    }
  };

  // ---------------------------------------------------------------
  // Delete User
  // ---------------------------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`users/${id}/`);
      alert("🗑️ User deleted successfully!");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
      <h1 style={{ color: "#b83280" }}>👥 Manage Users</h1>

      {/* Only owners/superusers can add users */}
      {currentRole !== "staff" && (
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingUser(null);
          }}
          style={{
            backgroundColor: "#b83280",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            margin: "1rem 0",
            border: "none",
            cursor: "pointer",
          }}
        >
          {showForm ? "Close Form" : "➕ Add New User"}
        </button>
      )}

      {/* FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: "#fff0f6",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <label>Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="staff">Staff</option>
              <option value="supervisor">Supervisor</option>
              <option value="owner">Owner</option>
              <option value="superuser">Superuser</option>
            </select>
          </div>

          {/* Password field only shown when creating a new user */}
          {!editingUser && (
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          )}

          <button
            type="submit"
            style={{
              backgroundColor: "#b83280",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              marginTop: "1rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            {editingUser ? "💾 Update User" : "➕ Create User"}
          </button>
        </form>
      )}

      {/* USER TABLE */}
      <table
        style={{
          width: "100%",
          marginTop: "2rem",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#ffe4ec" }}>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "✅" : "❌"}</td>

                <td>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormData(user);
                      setShowForm(true);
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ color: "red" }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
