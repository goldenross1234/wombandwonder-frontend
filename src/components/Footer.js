// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--brand-pink)",
        color: "white",
        textAlign: "center",
        padding: "1rem",
        fontSize: "0.9rem",
        marginTop: "auto",
      }}
    >
      <p>© {new Date().getFullYear()} Womb & Wonder. All Rights Reserved.</p>
    </footer>
  );
}
