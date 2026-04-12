import React from "react";
import "./dashboard.css";

export default function DashboardAbout() {
  return (
    <main className="dashboard-main" aria-label="About">
      <section className="dashboard-page-card">
        <h1 className="dashboard-page-card__title">About SmartAgri Farm</h1>
        <p className="dashboard-page-card__subtitle">
          Sustainable, data-driven farming for healthier crops and less waste.
        </p>
      </section>
      <section className="dashboard-page-card">
        <p className="dashboard-page-card__text">
          SmartAgri Farm helps farmers monitor soil and weather conditions in
          real time. The platform combines sensor data and simple controls so
          irrigation decisions are faster and easier.
        </p>
        <p className="dashboard-page-card__text">
          Our goal is to support sustainable farming by reducing water waste
          and improving crop health through reliable data.
        </p>
      </section>
    </main>
  );
}
