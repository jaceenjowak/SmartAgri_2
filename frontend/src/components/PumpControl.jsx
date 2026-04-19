import React, { useState } from "react";
import API from "../api/axios";

export default function PumpControl({ pumpOn, onToggle }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    const action = pumpOn ? "off" : "on";
    setLoading(true);
    setError("");
    try {
      await API.post("/irrigation/control", { action });
      onToggle(!pumpOn);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to control pump");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>💧 Irrigation Control</h3>
      <div style={styles.statusRow}>
        <span>Pump Status:</span>
        <span
          style={{
            ...styles.badge,
            background: pumpOn ? "#1a6b3c" : "#e74c3c",
          }}
        >
          {pumpOn ? "● ON" : "● OFF"}
        </span>
      </div>
      <button
        onClick={handleToggle}
        disabled={loading}
        style={{ ...styles.btn, background: pumpOn ? "#e74c3c" : "#1a6b3c" }}
      >
        {loading
          ? "Processing..."
          : pumpOn
            ? "Turn OFF Irrigation"
            : "Turn ON Irrigation"}
      </button>
      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.hint}>
        You can also enable auto-irrigation in Settings.
      </p>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    width: "100%",
    flex: 1,
    minHeight: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  heading: { margin: "0 0 20px", fontSize: "16px", color: "#1a6b3c" },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  badge: {
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
  },
  btn: {
    width: "100%",
    padding: "14px 16px",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
  },
  error: { color: "#e74c3c", fontSize: "13px", marginTop: "8px" },
  hint: {
    color: "#999",
    fontSize: "12px",
    marginTop: "auto",
    paddingTop: "20px",
    textAlign: "center",
  },
};
