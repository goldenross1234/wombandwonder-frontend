// src/pages/Patients/PatientAppointments.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ service: "", date: "", time: "", notes: "" });

  const token = localStorage.getItem("access");

  const fetchAppointments = async () => {
    const res = await axios.get(`${API_URL}/appointments/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/appointments/`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ service: "", date: "", time: "", notes: "" });
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2 style={{ color: "#e91e63" }}>My Appointments</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Service"
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button
          type="submit"
          style={{
            background: "#e91e63",
            color: "white",
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "25px",
            marginTop: "1rem",
          }}
        >
          Book Appointment
        </button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>📋 Appointment History</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.id}>
            {a.date} - {a.service} ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
