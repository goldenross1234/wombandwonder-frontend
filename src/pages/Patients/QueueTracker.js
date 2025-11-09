import React, { useEffect, useState } from "react";

export default function QueueTracker() {
  const [current, setCurrent] = useState(null);
  const [myNumber, setMyNumber] = useState("A-105");

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/queue/");
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.status === "serving") setCurrent(data.queue_number);
    };
    return () => socket.close();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Now Serving</h2>
      <h1 style={{ fontSize: "4rem", color: "#e91e63" }}>{current || "..."}</h1>

      <h3>Your Number: <span style={{ color: "#333" }}>{myNumber}</span></h3>
      <p>{current === myNumber ? "🎉 It's your turn!" : "Please wait for your number."}</p>
    </div>
  );
}
