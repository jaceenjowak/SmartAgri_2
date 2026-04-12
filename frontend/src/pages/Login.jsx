import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* LEFT GREEN PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.leftOverlay} />
        <div style={styles.decoCircle1} />
        <div style={styles.decoCircle2} />
        <div style={styles.decoCircle3} />
        <div style={styles.leftContent}>
          <div style={styles.logoCircle}>
            <img
            src="/logo2.png"
            alt="SmartAgri Logo"
            style={{ width: "48px", height: "48px", objectFit: "contain" }}
          />
          </div>
          <div style={styles.brandName}>
            SMARTAGRI
            <br />
            FARM
          </div>
          <p style={styles.brandTagline}>SmartAgri Farm</p>
          <p style={styles.brandSub}>Empowering Smart Agriculture</p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.topNav}>
          <Link to="/" style={styles.topNavLink}>
            Home
          </Link>
          <Link to="/" style={styles.topNavLink}>
            About
          </Link>
          <Link to="/" style={styles.topNavLink}>
            Contact
          </Link>
        </div>

        <div style={styles.formOuter}>
          <div style={styles.formBox}>
            <h2 style={styles.formTitle}>Login</h2>

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    style={styles.input}
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && <div style={styles.errorBox}>⚠️ {error}</div>}

              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
                disabled={loading}
              >
                {loading ? "⏳ Logging in..." : "Login"}
              </button>
            </form>

            <p style={styles.switchText}>
              Don't have an account?{" "}
              <Link to="/register" style={styles.switchLink}>
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const GREEN = "#1a6b3c";

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  leftPanel: {
    width: "38%",
    minWidth: "280px",
    background: GREEN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flexShrink: 0,
  },
  leftOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(160deg,rgba(255,255,255,0.06) 0%,rgba(0,0,0,0.12) 100%)",
  },
  decoCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    top: -60,
    left: -60,
  },
  decoCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    bottom: 30,
    right: -40,
  },
  decoCircle3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.05)",
    top: "50%",
    right: 24,
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#fff",
    padding: "40px 32px",
  },
  logoCircle: {
    width: "92px",
    height: "92px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    border: "3px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  brandName: {
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "2px",
    lineHeight: 1.25,
    marginBottom: "16px",
    textShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  brandTagline: {
    fontSize: "15px",
    fontWeight: 700,
    margin: "0 0 4px",
    opacity: 0.95,
  },
  brandSub: { fontSize: "13px", opacity: 0.8, margin: 0 },

  rightPanel: {
    flex: 1,
    background: "#f0f7f3",
    display: "flex",
    flexDirection: "column",
  },
  topNav: {
    display: "flex",
    gap: "24px",
    justifyContent: "flex-end",
    padding: "14px 32px",
    background: "#fff",
    borderBottom: "1px solid #e0e0e0",
  },
  topNavLink: {
    color: "#555",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: 500,
  },
  formOuter: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  formBox: { width: "100%", maxWidth: "380px" },
  formTitle: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#222",
    margin: "0 0 28px",
  },
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#444",
    marginBottom: "7px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1.5px solid #d0d0d0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  inputIcon: {
    padding: "0 10px",
    fontSize: "15px",
    borderRight: "1px solid #eee",
    userSelect: "none",
  },
  input: {
    flex: 1,
    padding: "11px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
    color: "#333",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    padding: "0 10px",
    cursor: "pointer",
    fontSize: "15px",
  },
  errorBox: {
    background: "#ffeaea",
    border: "1px solid #f5c6cb",
    color: "#c0392b",
    borderRadius: "7px",
    padding: "10px 14px",
    fontSize: "13px",
    marginBottom: "14px",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: GREEN,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "6px",
    letterSpacing: "0.3px",
  },
  switchText: {
    marginTop: "20px",
    fontSize: "13px",
    color: "#666",
    textAlign: "center",
  },
  switchLink: { color: GREEN, fontWeight: 700, textDecoration: "none" },
};
