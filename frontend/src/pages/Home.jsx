import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", icon: "🏠" },
    { label: "About", href: "#about", icon: "ⓘ" },
    { label: "How It Works", href: "#how", icon: "⚙️" },
    { label: "Features", href: "#features", icon: "🌿" },
    { label: "Contact", href: "#contact", icon: "✉️" },
  ];

  return (
    <div style={styles.root}>
      {/* NAVBAR */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <Link to="/" style={styles.brand}>
            <img
              src="/logo.png"
              alt="SmartAgri Logo"
              style={{ width: "36px", height: "36px", objectFit: "contain" }}
            />
            <span style={styles.brandText}>SMARTAGRI FARM</span>
          </Link>

          <div style={styles.navLinks}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} style={styles.navLink}>
                <span style={{ fontSize: "13px" }}>{l.icon}</span> {l.label}
              </a>
            ))}
          </div>

          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div style={styles.mobileMenu}>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {l.icon} {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroOverlay} />
        <img
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80"
          alt="Farm"
          style={styles.heroBg}
        />
        <div style={styles.heroContent}>
          <div style={styles.heroLogoCircle}>
            <img
              src="/logo.png"
              alt="SmartAgri Logo"
              style={{ width: "98px", height: "98px", objectFit: "contain" }}
            />
          </div>
          <h1 style={styles.heroTitle}>SMARTAGRI FARM</h1>
          <p style={styles.heroSub}>
            Empowering farmers through smart, automated, and sustainable
            agriculture.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/register" style={styles.heroBtnOutline}>
              Register
            </Link>
            <Link to="/login" style={styles.heroBtnOutline}>
              Login
            </Link>
          </div>
        </div>
      </section>

{/* WELCOME / ABOUT */}
<section id="about" style={styles.section}>
  <div style={styles.welcomeGrid}>
    <div style={styles.welcomeCircle}>
      <img
        src="/logo2.png"
        alt="SmartAgri Logo"
        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
      />
    </div>
    <div style={styles.welcomeText}>
      <h2 style={styles.sectionTitle}>Welcome to SMARTAGRI FARM</h2>
      <p style={styles.sectionBody}>
        Our system helps farmers monitor soil moisture, automate
        irrigation, and ensure optimal crop growth. Through easy-to-use
        dashboards, even those new to technology can track their farm's
        health in real time.
      </p>
    </div>
  </div>
</section>

      {/* HOW IT WORKS */}
      <section id="how" style={styles.sectionGreen}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>How It Works</h2>
          <p style={styles.sectionSubCenter}>
            Three simple steps to smarter farming
          </p>
          <div style={styles.stepsGrid}>
            {[
              {
                num: "01",
                icon: "📡",
                title: "Sensor Reads Soil",
                desc: "The ESP32 soil-moisture sensor continuously reads ground moisture levels and transmits data wirelessly to the server.",
              },
              {
                num: "02",
                icon: "🖥️",
                title: "Data Goes to Dashboard",
                desc: "Readings are sent to our web server in real time and displayed on your personalized farm dashboard instantly.",
              },
              {
                num: "03",
                icon: "💧",
                title: "Auto or Manual Irrigation",
                desc: "The system automatically activates irrigation when soil is dry, or you control it remotely from any device.",
              },
            ].map((s) => (
              <div key={s.num} style={styles.stepCard}>
                <div style={styles.stepNum}>{s.num}</div>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>
                  {s.icon}
                </div>
                <h3 style={styles.stepTitle}>{s.title}</h3>
                <p style={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Our Smart Farming Features</h2>
          <p style={styles.sectionSubCenter}>
            Discover how SmartAgri Farm helps farmers save time, resources, and
            effort.
          </p>
          <div style={styles.featBadgeRow}>
            <span style={styles.featBadge}>🌾 Key Features</span>
          </div>
          <div style={styles.featuresGrid}>
            {[
              {
                icon: "📶",
                title: "IoT Connectivity",
                desc: "Sensors connect via Wi-Fi to transmit real-time soil and weather data directly to your dashboard.",
                color: "#1a6b3c",
              },
              {
                icon: "💧",
                title: "Soil Moisture Monitoring",
                desc: "Monitor your soil's health and receive instant alerts when your plants need watering.",
                color: "#2980b9",
              },
              {
                icon: "🚿",
                title: "Automated Irrigation",
                desc: "Smart pumps automatically water crops based on live sensor readings, saving water and time.",
                color: "#27ae60",
              },
              {
                icon: "📊",
                title: "Data Visualization",
                desc: "View detailed analytics on soil conditions, water usage, and farm productivity trends.",
                color: "#8e44ad",
              },
              {
                icon: "🌤️",
                title: "Weather Integration",
                desc: "Factor in weather conditions to optimize irrigation schedules and prevent overwatering.",
                color: "#e67e22",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                desc: "JWT-protected accounts with role-based access ensure your farm data stays safe always.",
                color: "#c0392b",
              },
            ].map((f) => (
              <div key={f.title} style={styles.featureCard}>
                <div
                  style={{
                    fontSize: "32px",
                    marginBottom: "10px",
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <h3 style={{ ...styles.featureTitle, color: f.color }}>
                  {f.title}
                </h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {[
            { value: "40%", label: "Water Savings" },
            { value: "24/7", label: "Live Monitoring" },
            { value: "100%", label: "Remote Control" },
            { value: "< 5s", label: "Alert Response" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={styles.statVal}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.section}>
        <div
          style={{
            ...styles.container,
            textAlign: "center",
            maxWidth: "560px",
          }}
        >
          <h2 style={styles.sectionTitle}>Ready to Modernize Your Farm?</h2>
          <p style={{ ...styles.sectionBody, marginBottom: "28px" }}>
            Join SmartAgri Farm and start managing your irrigation smarter, not
            harder.
          </p>
          <div style={styles.ctaBtnWrap}>
            <Link to="/register" style={styles.ctaBtnGreen}>
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={styles.sectionGreen}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitleCenter}>Contact Us</h2>
          <p style={styles.sectionSubCenter}>
            Have questions? We're here to help.
          </p>
          <div style={styles.contactGrid}>
            {[
              {
                icon: "📍",
                label: "Address",
                val: "Cabadbaran City, Agusan del Norte, Philippines",
              },
              {
                icon: "📧",
                label: "Email",
                val: "chancellorsoffice@csucc.edu.ph",
              },
              { icon: "📞", label: "Phone", val: "(+63 85) 818-5583" },
            ].map((c) => (
              <div key={c.label} style={styles.contactCard}>
                <span style={{ fontSize: "30px" }}>{c.icon}</span>
                <strong style={{ color: "#1a6b3c", fontSize: "14px" }}>
                  {c.label}
                </strong>
                <span
                  style={{
                    color: "#666",
                    fontSize: "13px",
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {c.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ textAlign: "center" }}>
          <div style={styles.footerBrand}>🌱 SMARTAGRI FARM</div>
          <p style={styles.footerSub}>
            © 2025 SmartAgri Farm | Empowering Smart Agriculture 🌾
          </p>
        </div>
      </footer>
    </div>
  );
}

const GREEN = "#1a6b3c";
const GREEN_LIGHT = "#e8f5e9";

const styles = {
  root: {
    fontFamily: "'Segoe UI', sans-serif",
    color: "#222",
    overflowX: "hidden",
  },

  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: "rgba(255,255,255,0.97)",
    borderBottom: "1px solid #e0e0e0",
    transition: "box-shadow 0.3s",
  },
  navScrolled: { boxShadow: "0 2px 20px rgba(0,0,0,0.12)" },
  navInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textDecoration: "none",
    color: GREEN,
    fontWeight: 800,
    flexShrink: 0,
  },
  brandText: { fontSize: "14px", fontWeight: 800, letterSpacing: "0.5px" },
  navLinks: { display: "flex", gap: "2px", flex: 1, justifyContent: "center" },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 11px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#444",
    fontSize: "13px",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: GREEN,
    marginLeft: "auto",
  },
  mobileMenu: {
    background: "#fff",
    borderTop: `1px solid ${GREEN_LIGHT}`,
    display: "flex",
    flexDirection: "column",
    padding: "10px 20px 16px",
  },
  mobileLink: {
    padding: "10px 0",
    color: "#444",
    textDecoration: "none",
    fontSize: "14px",
    borderBottom: "1px solid #f0f0f0",
  },

  hero: {
    position: "relative",
    height: "100vh",
    minHeight: "520px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(to bottom, rgba(0,40,15,0.55) 0%, rgba(0,60,20,0.72) 100%)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#fff",
    padding: "0 20px",
  },
  heroLogoCircle: {
    width: "112px",
    height: "112px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    border: "2px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  heroTitle: {
    fontSize: "clamp(28px,5vw,52px)",
    fontWeight: 900,
    letterSpacing: "2px",
    margin: "0 0 12px",
    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
  },
  heroSub: {
    fontSize: "clamp(14px,2vw,18px)",
    opacity: 0.92,
    margin: "0 0 32px",
    maxWidth: "520px",
    lineHeight: 1.6,
    textShadow: "0 1px 6px rgba(0,0,0,0.3)",
  },
  heroBtns: {
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroBtnOutline: {
    padding: "12px 32px",
    background: "transparent",
    border: "2px solid rgba(255,255,255,0.85)",
    borderRadius: "30px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },

  section: { padding: "80px 20px", background: "#fff" },
  sectionGreen: { padding: "80px 20px", background: GREEN_LIGHT },
  container: { maxWidth: "1100px", margin: "0 auto" },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: 800,
    color: GREEN,
    margin: "0 0 14px",
  },
  sectionTitleCenter: {
    fontSize: "28px",
    fontWeight: 800,
    color: GREEN,
    margin: "0 0 10px",
    textAlign: "center",
  },
  sectionSubCenter: {
    textAlign: "center",
    color: "#666",
    fontSize: "15px",
    margin: "0 0 36px",
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  sectionBody: {
    color: "#555",
    fontSize: "15px",
    lineHeight: 1.8,
    maxWidth: "520px",
  },

  welcomeGrid: {
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap",
  },
  welcomeCircle: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    background: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 8px 40px ${GREEN}44`,
    flexShrink: 0,
  },
  welcomeText: { flex: 1, minWidth: "280px" },

  stepsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: "24px",
  },
  stepCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "32px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    textAlign: "center",
    border: `1px solid ${GREEN_LIGHT}`,
    position: "relative",
  },
  stepNum: {
    position: "absolute",
    top: "16px",
    right: "20px",
    fontSize: "40px",
    fontWeight: 900,
    color: `${GREEN}20`,
    lineHeight: 1,
  },
  stepTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: GREEN,
    margin: "0 0 10px",
  },
  stepDesc: { color: "#666", fontSize: "14px", lineHeight: 1.7 },

  featBadgeRow: { textAlign: "center", marginBottom: "28px" },
  featBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: GREEN_LIGHT,
    color: GREEN,
    fontWeight: 700,
    padding: "6px 18px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: "20px",
  },
  featureCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px 22px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    border: "1px solid #eee",
  },
  featureTitle: { fontSize: "15px", fontWeight: 700, margin: "0 0 8px" },
  featureDesc: { color: "#666", fontSize: "13px", lineHeight: 1.7 },

  statsSection: { background: GREEN, padding: "60px 20px" },
  statsGrid: {
    maxWidth: "900px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
    gap: "24px",
    textAlign: "center",
  },
  statVal: { fontSize: "42px", fontWeight: 900, color: "#fff", lineHeight: 1 },
  statLabel: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.8)",
    marginTop: "6px",
    fontWeight: 500,
  },

  ctaBtnGreen: {
    padding: "13px 34px",
    background: GREEN,
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },
  ctaBtnOutline: {
    padding: "13px 34px",
    border: `2px solid ${GREEN}`,
    color: GREEN,
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "15px",
  },
  ctaBtnWrap: {
    display: "flex",
    justifyContent: "center",
  },

  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
    marginTop: "16px",
  },
  contactCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  footer: { background: "#111", padding: "32px 20px" },
  footerBrand: {
    color: "#7ed876",
    fontWeight: 800,
    fontSize: "16px",
    marginBottom: "8px",
  },
  footerSub: { color: "#888", fontSize: "13px", margin: 0 },
};
