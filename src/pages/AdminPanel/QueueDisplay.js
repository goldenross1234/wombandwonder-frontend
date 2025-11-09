import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueDisplay() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  // ✅ Remove navbar, sidebar, footer → Full screen display
  useEffect(() => {
    const hideUI = () => {
      document.querySelector("nav")?.remove();
      document.querySelector(".admin-sidebar")?.remove();
      document.querySelector("footer")?.remove();
    };
    hideUI();
    setTimeout(hideUI, 500); // retry in case React re-renders
  }, []);

  // ✅ Auto refresh every 3 seconds
  useEffect(() => {
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    const res = await axios.get(`${API}/queue/`);
    setQueue(res.data);

    const serving = res.data.find((q) => q.status === "serving");
    setCurrent(serving ? serving.queue_number : null);
  };

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        background: "#fff1f7",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#d81b60" }}>NOW SERVING</h1>

      <div
        style={{
          fontSize: "10rem",
          fontWeight: "bold",
          marginTop: "20px",
          color: "#333",
        }}
      >
        {current || "—"}
      </div>

      <h2
        style={{
          marginTop: "60px",
          fontSize: "3rem",
          color: "#d81b60",
        }}
      >
        Waiting List
      </h2>

      {queue
        .filter((q) => q.status === "waiting")
        .map((q) => (
          <div
            key={q.id}
            style={{
              fontSize: "2.5rem",
              marginTop: "15px",
              color: q.priority === "priority" ? "#b71c1c" : "#444",
            }}
          >
            {q.queue_number} — {q.priority.toUpperCase()}
          </div>
        ))}
    </div>
  );
}
