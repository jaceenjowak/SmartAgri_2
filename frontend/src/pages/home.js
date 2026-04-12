import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./home.css";
import logo from "../assets/logo.png";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const updateNavOffset = () => {
      const nav = document.querySelector(".site-nav");
      const navHeight = nav?.getBoundingClientRect().height ?? 74;
      document.documentElement.style.setProperty(
        "--site-nav-offset",
        `${Math.ceil(navHeight) + 12}px`
      );
    };

    updateNavOffset();
    window.addEventListener("resize", updateNavOffset);
    return () => window.removeEventListener("resize", updateNavOffset);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location]);

  return (
    <div className="home">
      <SiteNav />

      <main className="home-main" aria-label="Home">
        <section className="home-hero">
          <h1 className="home-hero__title">SMARTAGRI FARM</h1>
          <p className="home-hero__subtitle">
            Empowering farmers through smart, automated and sustainable agriculture
          </p>
          <div className="home-hero__actions">
            <Link to="/register" className="home-hero__btn">
              Register
            </Link>
            <Link to="/login" className="home-hero__btn">
              Login
            </Link>
          </div>
        </section>

        <section className="home-welcome" aria-label="Welcome">
          <div className="home-welcome__inner">
            <div className="home-welcome__brand">
              <img src={logo} alt="SmartAgri Farm logo" className="home-welcome__logo" />
              <span className="home-welcome__brand-name">SMARTAGRI FARM</span>
            </div>
            <div className="home-welcome__text">
              <h2 className="home-welcome__title">Welcome to SMARTAGRI FARM</h2>
              <p className="home-welcome__body">
                Our system helps farmers monitor soil moisture, automate irrigation,
                and ensure optimal crop growth. Through easy-to-use dashboards,
                even those new to technology can track their farm in real time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
