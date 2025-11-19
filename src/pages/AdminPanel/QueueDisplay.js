import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";            // ✔ global axios
import { loadConfig } from "../../config/runtimeConfig"; // ✔ dynamic backend

export default function QueueDisplay() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState("—");
  const [popup, setPopup] = useState(null);
  const [lastServed, setLastServed] = useState(null);

  // ============================================================
  // HIDE ADMIN UI ELEMENTS
  // ============================================================
  useEffect(() => {
    const hideUI = () => {
      document.querySelector("nav")?.remove();
      document.querySelector(".admin-sidebar")?.remove();
      document.querySelector("footer")?.remove();
    };
    hideUI();
    setTimeout(hideUI, 500);
  }, []);

  // ============================================================
  // UNLOCK AUDIO ON FIRST USER CLICK
  // ============================================================
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio("/callnext.mp3");
      audio.play().catch(() => {});
      window.removeEventListener("click", unlockAudio);
    };
    window.addEventListener("click", unlockAudio);
  }, []);

  // ============================================================
  // INITIAL LOAD (CONFIG + QUEUE POLLING)
  // ============================================================
  useEffect(() => {
    async function init() {
      await loadConfig(); // ensures axiosConfig loads backend_url
      loadQueue();
    }
    init();

    const interval = setInterval(loadQueue, 3000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // LOAD QUEUE DATA
  // ============================================================
  const loadQueue = async () => {
    try {
      const res = await axios.get("queue/");
      setQueue(res.data);

      const serving = res.data.find((q) => q.status === "serving");

      // ---- Trigger popup if a new queue number is called ----
      if (serving && serving.queue_number !== lastServed) {
        setPopup(serving.queue_number);
        setLastServed(serving.queue_number);

        // Play the "next" sound
        const audio = new Audio("/callnext.mp3");
        audio.play().catch(() => {});

        // Hide popup after 4 sec
        setTimeout(() => setPopup(null), 4000);
      }

      setCurrent(serving ? serving.queue_number : "—");
    } catch (err) {
      console.error("QueueDisplay loadQueue error:", err);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        background: "#fff1f7",
        minHeight: "100vh",
      }}
    >
      {/* POPUP OVERLAY */}
      {popup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
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

      {/* CURRENT NUMBER */}
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

      {/* WAITING LIST */}
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
              animation:
                q.priority === "priority" ? "blink 1s infinite" : "none",
            }}
          >
            {q.queue_number} — {q.priority.toUpperCase()}
          </div>
        ))}
    </div>
  );
}
