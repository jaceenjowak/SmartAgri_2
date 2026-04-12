import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";

export default function Settings() {
  const [thresholds, setThresholds] = useState({
    dry_threshold: 30,
    wet_threshold: 70,
    auto_irrigation: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/thresholds")
      .then((res) => setThresholds(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await API.put("/thresholds", thresholds);
      setMessage("✅ Settings saved successfully!");
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Failed to save"));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <p style={{ padding: "40px", textAlign: "center" }}>Loading...</p>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7f3" }}>
      <Navbar />
      <div style={styles.content}>
        <h2 style={styles.title}>⚙️ Settings</h2>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Irrigation Thresholds</h3>
          <p style={styles.desc}>
            Configure when the system should trigger irrigation alerts and
            automation.
          </p>
          <form onSubmit={handleSave}>
            <label style={styles.label}>
              Dry Threshold (%) — irrigation activates below this
            </label>
            <input
              type="number"
              min="0"
              max="100"
              style={styles.input}
              value={thresholds.dry_threshold}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  dry_threshold: parseFloat(e.target.value),
                })
              }
            />
            <label style={styles.label}>
              Wet Threshold (%) — irrigation stops above this
            </label>
            <input
              type="number"
              min="0"
              max="100"
              style={styles.input}
              value={thresholds.wet_threshold}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  wet_threshold: parseFloat(e.target.value),
                })
              }
            />
            <div style={styles.toggleRow}>
              <span style={styles.label}>Enable Auto-Irrigation</span>
              <input
                type="checkbox"
                checked={thresholds.auto_irrigation}
                onChange={(e) =>
                  setThresholds({
                    ...thresholds,
                    auto_irrigation: e.target.checked,
                  })
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>
            {message && (
              <p
                style={{
                  fontSize: "14px",
                  marginTop: "10px",
                  color: message.startsWith("✅") ? "#1a6b3c" : "#e74c3c",
                }}
              >
                {message}
              </p>
            )}
            <button style={styles.btn} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  content: { maxWidth: "600px", margin: "0 auto", padding: "24px 20px" },
  title: { color: "#1a6b3c", marginBottom: "20px" },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  cardTitle: { margin: "0 0 8px", fontSize: "17px", color: "#1a6b3c" },
  desc: { color: "#666", fontSize: "13px", marginBottom: "24px" },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#555",
    marginBottom: "6px",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
  },
  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  btn: {
    width: "100%",
    padding: "12px",
    background: "#1a6b3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    marginTop: "24px",
  },
};
