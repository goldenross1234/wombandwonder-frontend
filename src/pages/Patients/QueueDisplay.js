import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueDisplay() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(`${API}/queue/`);
      const data = res.data;

      setQueue(data);

      const serving = data.find((q) => q.status === "serving");
      setCurrent(serving || null);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const waiting = queue.filter((q) => q.status === "waiting");

  return (
    <div
      style={{
        padding: "40px",
        background: "#ffeef5",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#a10b57",
      }}
    >
      <h1 style={{ fontSize: "4rem", textAlign: "center", marginBottom: "20px" }}>
        🩷 Womb & Wonder Queue Display
      </h1>

      {/* NOW SERVING */}
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "3rem", marginBottom: "10px" }}>NOW SERVING</h2>
        <div style={{ fontSize: "6rem", fontWeight: "bold" }}>
          {current ? current.queue_number : "—"}
        </div>
      </div>

      {/* NEXT IN LINE */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", marginBottom: "10px" }}>UP NEXT</h2>

        {waiting.slice(0, 3).map((q) => (
          <div
            key={q.id}
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: q.priority === "priority" ? "#d80032" : "#a10b57",
              marginBottom: "10px",
            }}
          >
            {q.queue_number}{" "}
            {q.priority === "priority" && (
              <span style={{ fontSize: "1.3rem", color: "#d80032" }}>
                (PRIORITY)
              </span>
            )}
          </div>
        ))}

        {waiting.length === 0 && <p style={{ fontSize: "1.3rem" }}>No one waiting</p>}
      </div>

      {/* FULL LIST */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>
          ALL WAITING PATIENTS
        </h2>

        <table style={{ width: "100%", fontSize: "1.5rem" }}>
          <thead>
            <tr>
              <th align="left">Queue #</th>
              <th align="left">Priority</th>
            </tr>
          </thead>
          <tbody>
            {waiting.map((q) => (
              <tr key={q.id}>
                <td style={{ padding: "8px 0" }}>
                  <b>{q.queue_number}</b>
                </td>
                <td style={{ color: q.priority === "priority" ? "#d80032" : "#333" }}>
                  {q.priority}
                </td>
              </tr>
            ))}

            {waiting.length === 0 && (
              <tr>
                <td colSpan={2}>No waiting patients.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
