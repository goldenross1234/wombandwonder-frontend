import React, { useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function AddPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    notes: "",
    priority: "regular"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/queue/`, form);
      alert("Patient added!");
      window.location.href = "/admin-panel/queue";
    } catch (err) {
      console.error(err);
      alert("Error adding patient!");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: 500 }}>
      <h1>➕ Add Patient to Queue</h1>

      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Notes:</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <label>Priority:</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 20 }}
        >
          <option value="regular">Regular</option>
          <option value="priority">Priority</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#d81b60",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          Add Patient
        </button>
      </form>
    </div>
  );
}
