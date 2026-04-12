import React from "react";
import SiteNav from "../components/SiteNav";
import "./features-page.css";

export const FEATURE_ITEMS = [
  {
    title: "IoT Connectivity",
    body: "Our sensor connect via WI-fi to transmit real-time soil and weather data directly your dashboard",
  },
  {
    title: "Soil Moisture Monitoring",
    body: "Monitoring your soil's health and recieve instant clients when your points need watering",
  },
  {
    title: "Automated Irrigation",
    body: "Smart pumps automatically water crops based in live sensor readings, saving water and time",
  },
  {
    title: "Data Visualization",
    body: "View detailed analytics on soil conditions water usage and form productivity trends",
  },
];

export default function Features() {
  return (
    <div className="features-page">
      <SiteNav />
      <main className="features-main">
        <section className="features-hero" aria-label="Features intro">
          <h1 className="features-hero__title">Our Smart Farming Feature</h1>
          <p className="features-hero__subtitle">
            Discover how SmartAgri Farm helps save time, resources and effort.
          </p>
        </section>
        <section className="features-section" aria-label="Feature cards">
          <h2 className="features-section__title">Key Features</h2>
          <div className="features-grid">
            {FEATURE_ITEMS.map((item) => (
              <article key={item.title} className="feature-card">
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__body">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
