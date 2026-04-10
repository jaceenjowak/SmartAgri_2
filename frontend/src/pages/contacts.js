import React from "react";
import SiteNav from "../components/SiteNav";
import "./info-page.css";

export default function Contacts() {
  return (
    <div className="info-page">
      <SiteNav />
      <main className="info-main">
        <section className="info-card">
          <h1 className="info-title">Contacts</h1>
          <p className="info-text">
            For support and partnerships, contact your local agricultural office
            or message our team through your dashboard account.
          </p>
          <p className="info-text">Email: support@smartagrifarm.local</p>
        </section>
      </main>
    </div>
  );
}
