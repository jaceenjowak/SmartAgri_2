import React from "react";
import { FEATURE_ITEMS } from "./features";
import "./dashboard.css";

export default function DashboardFeatures() {
  return (
    <main className="dashboard-main" aria-label="Features">
      <section className="dashboard-page-card">
        <h1 className="dashboard-page-card__title">Key features</h1>
        <p className="dashboard-page-card__subtitle">
          How SmartAgri Farm saves time, water, and effort on your operation.
        </p>
      </section>
      <section className="dashboard-page-card">
        <div className="dashboard-features-grid">
          {FEATURE_ITEMS.map((item) => (
            <article key={item.title} className="dashboard-feature-card">
              <h2 className="dashboard-feature-card__title">{item.title}</h2>
              <p className="dashboard-feature-card__body">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
