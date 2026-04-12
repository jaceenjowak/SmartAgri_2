import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./info-page.css";

export default function About() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="info-page">
      <SiteNav />
      <main className="info-main" aria-label="About">
        <section className="info-hero">
          <h1 className="info-hero__title">About SmartAgri Farm</h1>
          <p className="info-hero__subtitle">
            Sustainable, data-driven farming for healthier crops and less waste.
          </p>
        </section>
        <section className="info-content" aria-label="About details">
          <div className="info-content__inner">
            <p className="info-text">
              SmartAgri Farm helps farmers monitor soil and weather conditions in
              real time. The platform combines sensor data and simple controls so
              irrigation decisions are faster and easier.
            </p>
            <p className="info-text">
              Our goal is to support sustainable farming by reducing water waste
              and improving crop health through reliable data.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
