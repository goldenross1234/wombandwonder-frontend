// src/pages/AdminPanel/UserManager.js
import React, { useEffect, useState } from "react";
import axios from "axios";

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

  const token = localStorage.getItem("access");
  const currentRole = localStorage.getItem("role");

  // 🧠 Fetch all users
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, [token]);

  // 📝 Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ➕ Create or Update User
  const handleSubmit = (e) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (editingUser) {
      // ✏️ Update user
      axios
        .put(`http://127.0.0.1:8000/api/users/${editingUser.id}/`, formData, config)
        .then(() => {
          alert("✅ User updated successfully!");
          setEditingUser(null);
          setShowForm(false);
          fetchUsers();
        })
        .catch((err) => console.error("Error updating user:", err));
    } else {
      // ➕ Create new user
      axios
        .post("http://127.0.0.1:8000/api/users/", formData, config)
        .then(() => {
          alert("✅ User created successfully!");
          setFormData({ username: "", email: "", role: "staff", password: "" });
          setShowForm(false);
          fetchUsers();
        })
        .catch((err) => console.error("Error creating user:", err));
    }
  };

  // 🔄 Reload list after operations
  const fetchUsers = () => {
    axios
      .get("http://127.0.0.1:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  };

  // 🗑️ Delete User
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    axios
      .delete(`http://127.0.0.1:8000/api/users/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("🗑️ User deleted successfully!");
        setUsers(users.filter((u) => u.id !== id));
      })
      .catch((err) => console.error("Error deleting user:", err));
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto" }}>
      <h1 style={{ color: "#b83280" }}>👥 Manage Users</h1>

      {/* ✅ Add/Edit Button */}
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

      {/* 🧾 Add/Edit User Form */}
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

      {/* 📋 User Table */}
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
