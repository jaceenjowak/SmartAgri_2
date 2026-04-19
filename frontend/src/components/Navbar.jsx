import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Logs", to: "/logs" },
    { label: "Settings", to: "/settings" },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/dashboard" style={styles.brand}>
          <img
            src="/brand-logo.png"
            alt="SmartAgri Farm"
            style={styles.brandLogo}
          />
          <strong style={{ fontSize: "16px", letterSpacing: "0.3px" }}>
            SmartAgri Farm
          </strong>
        </Link>

        <div style={styles.links}>
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                style={{ ...styles.link, ...(active ? styles.linkActive : {}) }}
              >
                {item.label}
                {active && <span style={styles.activeDot} />}
              </Link>
            );
          })}
        </div>

        <div style={styles.right}>
          <NotificationBell />
          <div style={styles.userChip}>
            <span style={{ fontSize: "14px" }}>👤</span>
            <span style={styles.username}>{user?.username}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const GREEN = "#1a6b3c";

const styles = {
  nav: {
    background: GREEN,
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
  },
  inner: {
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    color: "#fff",
    flexShrink: 0,
  },
  brandLogo: {
    width: "40px",
    height: "40px",
    objectFit: "contain",
    borderRadius: "8px",
    flexShrink: 0,
  },
  links: { display: "flex", gap: "4px", flex: 1 },
  link: {
    position: "relative",
    padding: "6px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "rgba(255,255,255,0.8)",
    fontSize: "14px",
    fontWeight: 500,
  },
  linkActive: {
    color: "#fff",
    background: "rgba(255,255,255,0.15)",
    fontWeight: 700,
  },
  activeDot: {
    position: "absolute",
    bottom: "2px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#7ed876",
  },
  right: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "5px 12px",
  },
  username: { fontSize: "13px", color: "#c8f5d8", fontWeight: 600 },
  logoutBtn: {
    padding: "6px 16px",
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
  },
};
