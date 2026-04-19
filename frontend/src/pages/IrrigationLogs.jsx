import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function IrrigationLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/irrigation/logs")
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>📋 Irrigation Logs</h2>
        <div style={styles.card}>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : logs.length === 0 ? (
            <p style={styles.empty}>No irrigation events recorded yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Trigger</th>
                  <th style={styles.th}>Moisture at Trigger</th>
                  <th style={styles.th}>Water Applied</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={styles.tr}>
                    <td style={styles.td}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            log.action === "on" ? "#1a6b3c" : "#e74c3c",
                        }}
                      >
                        {log.action.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.triggerBadge,
                          background:
                            log.trigger_type === "auto" ? "#2980b9" : "#e67e22",
                        }}
                      >
                        {log.trigger_type}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {log.moisture_at_trigger
                        ? `${log.moisture_at_trigger}%`
                        : "—"}
                    </td>
                    <td style={styles.td}>
                      {log.water_applied_liters
                        ? `${log.water_applied_liters} L`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerBrand}>SmartAgri Farm</span>
          <span style={styles.footerSep}>·</span>
          <span style={styles.footerMeta}>
            © {new Date().getFullYear()} Smart agriculture monitoring
          </span>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f7f3",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 20px",
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
  },
  title: { color: "#1a6b3c", marginBottom: "20px" },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    overflowX: "auto",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8f9fa" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "13px",
    color: "#555",
    fontWeight: 600,
    borderBottom: "2px solid #eee",
  },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#444" },
  badge: {
    color: "#fff",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 600,
  },
  triggerBadge: {
    color: "#fff",
    padding: "3px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  empty: { textAlign: "center", color: "#999", padding: "40px" },
  footer: {
    marginTop: "auto",
    background: "#1a6b3c",
    color: "rgba(255,255,255,0.85)",
    padding: "14px 20px",
    fontSize: "13px",
    textAlign: "center",
  },
  footerInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  footerBrand: { fontWeight: 700, color: "#fff" },
  footerSep: { opacity: 0.5 },
  footerMeta: { color: "rgba(255,255,255,0.75)" },
};
