// src/pages/Patients/PatientDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function PatientDashboard() {
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/business-days/`)
      .then((res) => setCalendar(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 style={{ color: "#e91e63" }}>Welcome to Patients Corner</h1>
      <p className="mt-2">Check our clinic schedule below.</p>

      <div style={{ marginTop: "2rem" }}>
        <h3>📅 Clinic Schedule</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fce4ec" }}>
              <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Note</th>
            </tr>
          </thead>
          <tbody>
            {calendar.map((day) => (
              <tr key={day.id}>
                <td style={{ padding: "8px" }}>{day.date}</td>
                <td
                  style={{
                    padding: "8px",
                    color: day.is_open ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {day.is_open ? "Open" : "Closed"}
                </td>
                <td style={{ padding: "8px" }}>{day.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
