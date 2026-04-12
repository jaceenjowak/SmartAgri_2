import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setError("");
    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        username: form.username,
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const mismatch = form.confirm && form.password !== form.confirm;

  return (
    <div style={styles.page}>
      {/* LEFT GREEN PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.leftOverlay} />
        <div style={styles.decoCircle1} />
        <div style={styles.decoCircle2} />
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
          <div style={styles.bullets}>
            <div style={styles.bullet}>✅ Real-time soil monitoring</div>
            <div style={styles.bullet}>✅ Automated irrigation</div>
            <div style={styles.bullet}>✅ Remote pump control</div>
            <div style={styles.bullet}>✅ Smart notifications</div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.topNav}>
          <Link to="/" style={styles.topNavLink}>
            Home
          </Link>
          <Link to="/login" style={styles.topNavLink}>
            Login
          </Link>
        </div>

        <div style={styles.formOuter}>
          <div style={styles.formBox}>
            <h2 style={styles.formTitle}>Create Your Account</h2>
            <p style={styles.formSub}>
              Join SmartAgri Farm and manage your fields smarter.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Full Name <span style={styles.req}>*</span>
                </label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={set("full_name")}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Email Address <span style={styles.req}>*</span>
                </label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Username <span style={styles.req}>*</span>
                </label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>🏷️</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={set("username")}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Password <span style={styles.req}>*</span>
                </label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    style={styles.input}
                    type={showPass ? "text" : "password"}
                    placeholder="Minimum 6 characters"
                    value={form.password}
                    onChange={set("password")}
                    required
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

              {/* Confirm Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Confirm Password <span style={styles.req}>*</span>
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    borderColor: mismatch ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={styles.inputIcon}>🔐</span>
                  <input
                    style={styles.input}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={set("confirm")}
                    required
                  />
                  <button
                    type="button"
                    style={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {mismatch && (
                  <p style={styles.fieldErr}>Passwords don't match</p>
                )}
              </div>

              {error && <div style={styles.errorBox}>⚠️ {error}</div>}

              <button
                type="submit"
                style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
                disabled={loading}
              >
                {loading ? "⏳ Creating account..." : "Register"}
              </button>
            </form>

            <p style={styles.switchText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.switchLink}>
                Login
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
    width: "36%",
    minWidth: "260px",
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
      "linear-gradient(160deg,rgba(255,255,255,0.05) 0%,rgba(0,0,0,0.12) 100%)",
  },
  decoCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.07)",
    top: -60,
    left: -60,
  },
  decoCircle2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    bottom: 30,
    right: -30,
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    color: "#fff",
    padding: "36px 28px",
  },
  logoCircle: {
    width: "84px",
    height: "84px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.18)",
    border: "3px solid rgba(255,255,255,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 18px",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: 900,
    letterSpacing: "2px",
    lineHeight: 1.25,
    marginBottom: "14px",
    textShadow: "0 2px 8px rgba(0,0,0,0.25)",
  },
  brandTagline: {
    fontSize: "14px",
    fontWeight: 700,
    margin: "0 0 4px",
    opacity: 0.95,
  },
  brandSub: { fontSize: "12px", opacity: 0.8, margin: "0 0 22px" },
  bullets: { textAlign: "left", display: "inline-block" },
  bullet: { fontSize: "13px", opacity: 0.9, marginBottom: "7px" },

  rightPanel: {
    flex: 1,
    background: "#f0f7f3",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
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
    padding: "36px 20px",
  },
  formBox: { width: "100%", maxWidth: "390px" },
  formTitle: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#222",
    margin: "0 0 6px",
  },
  formSub: { color: "#666", fontSize: "13px", margin: "0 0 22px" },
  fieldGroup: { marginBottom: "15px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#444",
    marginBottom: "6px",
  },
  req: { color: "#e74c3c" },
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
    fontSize: "14px",
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
    fontSize: "14px",
  },
  fieldErr: { color: "#e74c3c", fontSize: "11px", margin: "4px 0 0" },
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
  },
  switchText: {
    marginTop: "18px",
    fontSize: "13px",
    color: "#666",
    textAlign: "center",
  },
  switchLink: { color: GREEN, fontWeight: 700, textDecoration: "none" },
};
