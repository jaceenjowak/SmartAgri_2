import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./site-nav.css";

export default function SiteNav({ showAuthLinks = true, appMode = false }) {
  const brandPath = appMode ? "/dashboard" : "/";
  const aboutPath = appMode ? "/dashboard/about" : "/about";
  const featuresPath = appMode ? "/dashboard/features" : "/features";
  const contactsPath = appMode ? "/dashboard/contacts" : "/contacts";

  return (
    <header className="site-nav">
      <Link
        to={brandPath}
        className="site-nav__brand"
        aria-label={appMode ? "Smart Agri Farm dashboard" : "Smart Agri Farm home"}
      >
        <img src={logo} alt="" className="site-nav__logo" />
      </Link>
      <nav className="site-nav__links" aria-label="Main">
        {appMode ? (
          <Link to="/dashboard">Dashboard</Link>
        ) : (
          <Link to="/">Home</Link>
        )}
        <Link to={aboutPath}>About</Link>
        <Link to={featuresPath}>Features</Link>
        <Link to={contactsPath}>Contacts</Link>
        {showAuthLinks && <Link to="/register">Register</Link>}
        {showAuthLinks && <Link to="/login">Login</Link>}
      </nav>
    </header>
  );
}
