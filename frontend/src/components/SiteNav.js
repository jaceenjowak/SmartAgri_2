import React from "react";
import { Link } from "react-router-dom";
import "./site-nav.css";

export default function SiteNav({ showAuthLinks = true }) {
  return (
    <header className="site-nav">
      <Link to="/" className="site-nav__brand">
        SMART AGRI FARM
      </Link>
      <nav className="site-nav__links" aria-label="Main">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/features">Features</Link>
        <Link to="/contacts">Contacts</Link>
        {showAuthLinks && <Link to="/register">Register</Link>}
        {showAuthLinks && <Link to="/login">Login</Link>}
      </nav>
    </header>
  );
}
