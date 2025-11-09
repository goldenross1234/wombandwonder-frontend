import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QueueQR() {
  const queueUrl = `${window.location.origin}/queue-join`;

  console.log("QR Rendering:", queueUrl); // sanity check

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "#fff0f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
      }}
    >
      <h1 style={{ color: "#a30c5b", fontSize: "2rem", marginBottom: "1rem" }}>
        🩷 Womb & Wonder Queue QR
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <QRCodeCanvas
          value={queueUrl}
          size={240}
          bgColor="#ffffff"
          fgColor="#a30c5b"
          includeMargin={true}
          level="H"
        />
      </div>

      <p style={{ color: "#444" }}>Scan this QR to join the queue</p>
      <p style={{ fontSize: "0.9rem", color: "#777" }}>{queueUrl}</p>
    </div>
  );
}
