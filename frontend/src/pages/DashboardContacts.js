import React from "react";
import "./dashboard.css";

export default function DashboardContacts() {
  return (
    <main className="dashboard-main" aria-label="Contacts">
      <section className="dashboard-page-card">
        <h1 className="dashboard-page-card__title">Contacts</h1>
        <p className="dashboard-page-card__subtitle">
          Reach out for support, partnerships, or questions about SmartAgri Farm.
        </p>
      </section>
      <section className="dashboard-page-card">
        <p className="dashboard-page-card__text">
          For support and partnerships, contact your local agricultural office
          or message our team through your dashboard account.
        </p>
        <p className="dashboard-page-card__text dashboard-page-card__text--emphasis">
          Email: support@smartagrifarm.local
        </p>
      </section>
    </main>
  );
}
