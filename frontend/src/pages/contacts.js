import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./info-page.css";

export default function Contacts() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="info-page">
      <SiteNav />
      <main className="info-main" aria-label="Contact">
        <section className="info-hero">
          <h1 className="info-hero__title">Contacts</h1>
          <p className="info-hero__subtitle">
            Reach out for support, partnerships, or questions about SmartAgri Farm.
          </p>
        </section>
        <section className="info-content" aria-label="Contact details">
          <div className="info-content__inner">
            <p className="info-text">
              For support and partnerships, contact your local agricultural office
              or message our team through your dashboard account.
            </p>
            <p className="info-text info-text--emphasis">
              Email: support@smartagrifarm.local
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
