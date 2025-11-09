import React, { useState } from "react";
import axios from "axios";
import "./QueueAdd.css"; // ✅ Create this CSS file and paste your styles there

const API = "http://127.0.0.1:8000/api";

export default function QueueAdd() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    notes: "",
    priority: "regular",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/queue/`, form);
      alert("✅ Patient added to queue!");
      window.location.href = "/admin-panel/queue";
    } catch (err) {
      alert("❌ Error adding patient");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>➕ Add Patient to Queue</h3>

        <form className="modal-form" onSubmit={submitForm}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            placeholder="Enter any important details..."
          ></textarea>

          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="regular">Regular</option>
            <option value="priority">Priority</option>
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => (window.location.href = "/admin-panel/queue")}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
