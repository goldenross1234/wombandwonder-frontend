import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueDisplay() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState("—");
  const [popup, setPopup] = useState(null);
  const [lastServed, setLastServed] = useState(null);

  // remove admin UI if present
  useEffect(() => {
    const hideUI = () => {
      document.querySelector("nav")?.remove();
      document.querySelector(".admin-sidebar")?.remove();
      document.querySelector("footer")?.remove();
    };
    hideUI();
    setTimeout(hideUI, 500);
  }, []);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadQueue = async () => {
    try {
      const res = await axios.get(`${API}/queue/`);
      setQueue(res.data);

      const serving = res.data.find((q) => q.status === "serving");

      // show popup only when a new serving number appears
      if (serving && serving.queue_number !== lastServed) {
        setPopup(serving.queue_number);
        setLastServed(serving.queue_number);

        // play sound (file should be present at /public/callnext.mp3)
        const audio = new Audio("/callnext.mp3");
        audio.play().catch((e) => {
          // ignore autoplay errors in some browsers
          console.debug("audio play failed:", e);
        });

        // auto-hide popup after 4 seconds
        setTimeout(() => setPopup(null), 4000);
      }

      setCurrent(serving ? serving.queue_number : "—");
    } catch (err) {
      console.error("loadQueue error:", err);
    }
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
      {popup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px 80px",
              borderRadius: "20px",
              textAlign: "center",
              animation: "popscale 0.3s ease",
            }}
          >
            <h1 style={{ fontSize: "70px", color: "#d81b60" }}>NOW SERVING</h1>
            <h2 style={{ fontSize: "120px", marginTop: "20px" }}>{popup}</h2>
          </div>
        </div>
      )}

      <h1 style={{ fontSize: "4rem", color: "#d81b60" }}>NOW SERVING</h1>

      <div
        style={{
          fontSize: "10rem",
          fontWeight: "bold",
          marginTop: "20px",
          color: "#333",
        }}
      >
        {current}
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
              color: q.priority === "priority" ? "#b71c1c" : "#333",
              animation: q.priority === "priority" ? "blink 1s infinite" : "none",
            }}
          >
            {q.queue_number} — {q.priority.toUpperCase()}
          </div>
        ))}
    </div>
  );
}
