import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

const typeIcons = {
  dry_alert: "⚠️",
  pump_on: "💧",
  pump_off: "🔴",
  system: "ℹ️",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/notifications")
      .then((res) => setNotifications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await API.patch("/notifications/read-all");
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await API.patch(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f3" }}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔔 Notifications</h2>
          {notifications.some((n) => !n.is_read) && (
            <button onClick={markAllRead} style={styles.markAllBtn}>
              Mark all as read
            </button>
          )}
        </div>
        <div style={styles.list}>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : notifications.length === 0 ? (
            <p style={styles.empty}>No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  ...styles.item,
                  background: n.is_read ? "#fff" : "#f0faf4",
                }}
                onClick={() => !n.is_read && markRead(n.id)}
              >
                <span style={styles.icon}>{typeIcons[n.type] || "ℹ️"}</span>
                <div style={styles.body}>
                  <p style={styles.msg}>{n.message}</p>
                  <p style={styles.time}>
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.is_read && <span style={styles.dot} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: { maxWidth: "800px", margin: "0 auto", padding: "24px 20px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { margin: 0, color: "#1a6b3c" },
  markAllBtn: {
    padding: "8px 16px",
    background: "#1a6b3c",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    cursor: "pointer",
    border: "1px solid #e8f5e9",
  },
  icon: { fontSize: "22px", marginTop: "2px" },
  body: { flex: 1 },
  msg: { margin: 0, fontSize: "14px", color: "#333" },
  time: { margin: "4px 0 0", fontSize: "12px", color: "#aaa" },
  dot: {
    width: "10px",
    height: "10px",
    background: "#1a6b3c",
    borderRadius: "50%",
    marginTop: "6px",
    flexShrink: 0,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    padding: "60px",
    background: "#fff",
    borderRadius: "10px",
  },
};
