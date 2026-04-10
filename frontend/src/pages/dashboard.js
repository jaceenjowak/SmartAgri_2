import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import Chart from "chart.js/auto";
import SiteNav from "../components/SiteNav";
import "./dashboard.css";

const firebaseConfig = {
  databaseURL:
    "https://smartagri-801ca-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
getDatabase(app);

const TIME_LABELS = [
  "6AM",
  "7AM",
  "8AM",
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
  "6PM",
  "7PM",
  "8PM",
];

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon" aria-hidden>
        {icon}
      </div>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [soil, setSoil] = useState("--");
  const [temp, setTemp] = useState("--");
  const [tank, setTank] = useState(0);
  const [relay, setRelay] = useState("OFF");
  const [runtime, setRuntime] = useState(0);
  const [water, setWater] = useState("--");
  const alerts = [];
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.username) setDisplayName(u.username);
        else if (u?.first_name) setDisplayName(u.first_name);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: [...TIME_LABELS],
        datasets: [
          {
            label: "Soil Moisture (%)",
            data: TIME_LABELS.map(() =>
              Math.floor(Math.random() * 25) + 38
            ),
            borderColor: "#2e7d32",
            backgroundColor: "rgba(46,125,50,0.12)",
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "#1b1b1b",
            pointBorderColor: "#1b1b1b",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { color: "rgba(0,0,0,0.06)" },
            ticks: { maxRotation: 45, minRotation: 0, font: { size: 11 } },
            title: {
              display: true,
              text: "Time",
              font: { size: 12, weight: "600" },
              color: "#374151",
            },
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: "rgba(0,0,0,0.06)" },
            title: {
              display: true,
              text: "Soil Moisture (%)",
              font: { size: 12, weight: "600" },
              color: "#374151",
            },
          },
        },
      },
    });

    return () => chartInstance.current?.destroy();
  }, []);

  useEffect(() => {
    const mock = {
      soil_percent: 9.6,
      temperature: 31,
      tank_level: 76,
      relay_status: "OFF",
      pump_on_seconds: 12,
    };

    setSoil(mock.soil_percent);
    setTemp(mock.temperature);
    setTank(mock.tank_level);
    setRelay(mock.relay_status);
    setRuntime(mock.pump_on_seconds);

    const desired = 55;
    const gap = Math.max(0, desired - mock.soil_percent);
    setWater((gap * 0.08).toFixed(2));

    setLoading(false);

    const interval = setInterval(() => {
      if (!chartInstance.current) return;
      const chart = chartInstance.current;
      const next = chart.data.datasets[0].data.map(() =>
        Math.floor(Math.random() * 22) + 38
      );
      chart.data.datasets[0].data = next;
      chart.update();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading SmartAgri Dashboard...</h2>
      </div>
    );
  }

  const relayDisplay =
    relay === "ON" ? `${relay} 🟢` : `${relay} 🔴`;

  return (
    <div className="dashboard">
      <SiteNav showAuthLinks={false} />

      <main className="dashboard-main">
        <section className="dashboard-welcome">
          <h1 className="dashboard-welcome__title">
            <span className="dashboard-welcome__leaf" aria-hidden>
              🌿
            </span>
            Welcome, {displayName}
          </h1>
          <p className="dashboard-welcome__subtitle">
            Real-time sensor monitoring connected to Firebase.
          </p>
        </section>

        <section className="dashboard-stats" aria-label="Sensor readings">
          <StatCard icon="🌱" label="Soil Moisture" value={`${soil}%`} />
          <StatCard icon="🌡️" label="Temperature" value={`${temp}°C`} />
          <StatCard icon="💧" label="Water Tank Level" value={`${tank}%`} />
          <StatCard icon="⚡" label="Relay Status" value={relayDisplay} />
          <StatCard icon="⏱️" label="Pump Runtime" value={`${runtime}s`} />
          <StatCard icon="🚿" label="Water Needed" value={`${water} L`} />
        </section>

        <section className="dashboard-chart-section" aria-label="Soil moisture chart">
          <div className="dashboard-chart-card">
            <canvas ref={chartRef} />
          </div>
        </section>
      </main>

      <div className="dashboard-alerts">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="dashboard-alert"
            style={{
              borderLeft:
                a.kind === "dry"
                  ? "4px solid #f57c00"
                  : "4px solid #0288d1",
            }}
          >
            <strong>{a.title}</strong>
            <p>{a.message}</p>
            <small>{a.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
