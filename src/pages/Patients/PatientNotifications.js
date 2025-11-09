// src/pages/Patients/PatientNotifications.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`${API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data));
  }, []);

  return (
    <div>
      <h2 style={{ color: "#e91e63" }}>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <b>{n.message}</b> — {new Date(n.created_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
