import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import SensorCard from "../components/SensorCard";
import MoistureChart from "../components/MoistureChart";
import PumpControl from "../components/PumpControl";
import API from "../api/axios";

export default function Dashboard() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [pumpOn, setPumpOn] = useState(false);
  const [waterNeeded, setWaterNeeded] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [latestRes, historyRes] = await Promise.all([
        API.get("/sensor/latest"),
        API.get("/sensor/history?limit=20"),
      ]);
      setLatest(latestRes.data.reading);
      setPumpOn(latestRes.data.pump_on);
      setWaterNeeded(latestRes.data.water_to_sprinkle);
      setHistory(historyRes.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getMoistureStatus = (val) => {
    if (val === null || val === undefined) return "No data";
    if (val < 30) return "⚠️ Dry — irrigation needed";
    if (val > 70) return "✅ Well hydrated";
    return "🌿 Optimal range";
  };

  if (loading)
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px", color: "#666" }}>
          Loading dashboard...
        </div>
      </div>
    );

  const m = latest;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>🌾 Farm Dashboard</h2>
          <p style={styles.subtitle}>
            Real-time sensor monitoring — updates every 15 seconds
          </p>
        </div>

        <div style={styles.cardsRow}>
          <SensorCard
            title="Soil Moisture"
            value={m?.moisture_percent?.toFixed(1)}
            unit="%"
            icon="💧"
            color="#1a6b3c"
            subtitle={getMoistureStatus(m?.moisture_percent)}
          />
          <SensorCard
            title="Temperature"
            value={m?.temperature?.toFixed(1)}
            unit="°C"
            icon="🌡️"
            color="#e67e22"
          />
          <SensorCard
            title="Water Tank Level"
            value={m?.water_tank_level?.toFixed(1)}
            unit="%"
            icon="🪣"
            color="#2980b9"
          />
          <SensorCard
            title="Water to Sprinkle"
            value={waterNeeded}
            unit="L"
            icon="🚿"
            color="#8e44ad"
            subtitle="To reach 60% moisture target"
          />
        </div>

        {pumpOn && (
          <div style={styles.alert}>
            💦 <strong>Irrigation Active</strong> — Pump is currently running
          </div>
        )}

        <div style={styles.mainRow}>
          <div style={{ flex: 2 }}>
            <MoistureChart data={history} />
          </div>
          <div style={{ flex: 1 }}>
            <PumpControl pumpOn={pumpOn} onToggle={setPumpOn} />
          </div>
        </div>

        <p style={styles.lastUpdated}>
          Last reading:{" "}
          {m ? new Date(m.created_at).toLocaleString() : "No readings yet"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f0f7f3" },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" },
  header: { marginBottom: "24px" },
  pageTitle: { margin: 0, fontSize: "24px", color: "#1a6b3c" },
  subtitle: { margin: "4px 0 0", color: "#666", fontSize: "13px" },
  cardsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  alert: {
    background: "#d4edda",
    color: "#155724",
    padding: "12px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
  },
  mainRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  lastUpdated: { textAlign: "right", color: "#aaa", fontSize: "12px" },
};
