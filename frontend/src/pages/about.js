import React from "react";
import SiteNav from "../components/SiteNav";
import "./info-page.css";

export default function About() {
  return (
    <div className="info-page">
      <SiteNav />
      <main className="info-main">
        <section className="info-card">
          <h1 className="info-title">About SmartAgri Farm</h1>
          <p className="info-text">
            SmartAgri Farm helps farmers monitor soil and weather conditions in
            real time. The platform combines sensor data and simple controls so
            irrigation decisions are faster and easier.
          </p>
          <p className="info-text">
            Our goal is to support sustainable farming by reducing water waste
            and improving crop health through reliable data.
          </p>
        </section>
      </main>
    </div>
  );
}
