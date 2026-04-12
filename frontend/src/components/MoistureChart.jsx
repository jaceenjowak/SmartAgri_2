import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function MoistureChart({ data }) {
  const labels = data.map((d) =>
    new Date(d.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Soil Moisture (%)",
        data: data.map((d) => d.moisture_percent),
        borderColor: "#1a6b3c",
        backgroundColor: "rgba(26, 107, 60, 0.08)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: "Moisture (%)" },
      },
    },
  };

  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>Soil Moisture Trend</h3>
      {data.length === 0 ? (
        <p style={styles.empty}>No data yet. Waiting for sensor readings...</p>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  heading: { margin: "0 0 16px", fontSize: "16px", color: "#1a6b3c" },
  empty: { color: "#999", textAlign: "center", padding: "40px 0" },
};
