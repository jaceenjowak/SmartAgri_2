import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Ordered checks while typing — full name rules. */
function getFullNameValidationErrors(name) {
  const errors = [];
  if (!name) return errors;

  if (/\d/.test(name)) {
    errors.push("Name must not contain numbers.");
  }

  if (/[^a-zA-Z\s\d]/.test(name)) {
    errors.push("Name may only contain letters and spaces.");
  }

  const lettersAndSpacesOnly = /^[a-zA-Z\s]+$/.test(name);
  if (lettersAndSpacesOnly) {
    if (/([a-zA-Z])\1{2}/i.test(name)) {
      errors.push(
        "Name must not contain three identical letters in a row (for example: Jooohn).",
      );
    }

    const trimmed = name.trim();
    if (trimmed.length > 0) {
      const words = trimmed.split(/\s+/).filter(Boolean);
      const badWord = words.find((w) => !/^[A-Z][a-z]*$/.test(w));
      if (badWord) {
        errors.push(
          "Each word must start with a capital letter, followed only by lowercase letters (for example: Juan Dela Cruz).",
        );
      }
    }
  }

  return errors;
}

function getEmailValidationErrors(email) {
  const errors = [];
  if (!email || !email.trim()) return errors;
  const t = email.trim();
  if (/\s/.test(t)) {
    errors.push("Email must not contain spaces.");
  }
  const lower = t.toLowerCase();
  if (!lower.endsWith("@gmail.com")) {
    errors.push("Email must be a Gmail address ending with @gmail.com.");
    return errors;
  }
  const idx = lower.lastIndexOf("@gmail.com");
  const local = lower.slice(0, idx);
  if (!local || local.includes("@")) {
    errors.push(
      "Use a valid Gmail address (for example: jaceen.jowak@gmail.com).",
    );
  }
  return errors;
}

function getUsernameValidationErrors(username) {
  const errors = [];
  if (!username || !username.trim()) return errors;
  const t = username.trim();
  if (!t.includes(".")) {
    errors.push(
      "Username must contain a dot between two parts (for example: jaceen.jowak).",
    );
    return errors;
  }
  if (!/^[a-z]+\.[a-z]+$/.test(t)) {
    errors.push(
      "Username must be only lowercase letters, one dot, in the form: firstname.lastname (for example: jaceen.jowak).",
    );
  }
  return errors;
}

/** Title-style words: capital first, then lowercase / digits / , . - ' in each word. */
function getAddressValidationErrors(address) {
  const errors = [];
  if (!address || !address.trim()) return errors;
  const t = address.trim();
  if (!/^[A-Z]/.test(t)) {
    errors.push("Address must begin with a capital letter.");
  }
  const wordPattern = /^[A-Z][a-z0-9,.'-]*$/;
  const words = t.split(/\s+/).filter(Boolean);
  for (const w of words) {
    const letterIdx = w.search(/[A-Za-z]/);
    if (letterIdx === -1) continue;
    const slice = w.slice(letterIdx);
    if (!wordPattern.test(slice)) {
      errors.push(
        "Each word that starts with a letter must use one capital letter first, then only lowercase letters, numbers, or , . - ' (for example: Purok 5 San Isidro Street).",
      );
      break;
    }
  }
  return errors;
}

function getPasswordChecks(password) {
  const p = password ?? "";
  return {
    minLen: p.length >= 6,
    hasNumber: /\d/.test(p),
    hasUpper: /[A-Z]/.test(p),
    hasSpecial: /[^A-Za-z0-9]/.test(p),
  };
}

function isPasswordValid(password) {
  const c = getPasswordChecks(password);
  return c.minLen && c.hasNumber && c.hasUpper && c.hasSpecial;
}

/** First rule still failing — one red message at a time while typing. */
function getCurrentPasswordError(password) {
  const p = password ?? "";
  if (!p.length) return null;
  if (isPasswordValid(p)) return null;
  if (p.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (!/\d/.test(p)) {
    return "Password must contain at least one number (0–9).";
  }
  if (!/[A-Z]/.test(p)) {
    return "Password must contain at least one capital letter (A–Z).";
  }
  if (!/[^A-Za-z0-9]/.test(p)) {
    return "Password must contain at least one special character (for example ! @ # $).";
  }
  return null;
}

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    address: "",
    phone_number: "",
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

  const nameValidationErrors = useMemo(
    () => getFullNameValidationErrors(form.full_name),
    [form.full_name],
  );

  const emailValidationErrors = useMemo(
    () => getEmailValidationErrors(form.email),
    [form.email],
  );

  const usernameValidationErrors = useMemo(
    () => getUsernameValidationErrors(form.username),
    [form.username],
  );

  const addressValidationErrors = useMemo(
    () => getAddressValidationErrors(form.address),
    [form.address],
  );

  const passwordFieldError = useMemo(
    () => getCurrentPasswordError(form.password),
    [form.password],
  );

  const clientValidationErrors = useMemo(
    () => [
      ...nameValidationErrors,
      ...emailValidationErrors,
      ...usernameValidationErrors,
      ...addressValidationErrors,
    ],
    [
      nameValidationErrors,
      emailValidationErrors,
      usernameValidationErrors,
      addressValidationErrors,
    ],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameErrs = getFullNameValidationErrors(form.full_name);
    if (nameErrs.length) {
      setError("");
      return;
    }
    const emailErrs = getEmailValidationErrors(form.email);
    if (emailErrs.length) {
      setError("");
      return;
    }
    const userErrs = getUsernameValidationErrors(form.username);
    if (userErrs.length) {
      setError("");
      return;
    }
    const addrErrs = getAddressValidationErrors(form.address);
    if (addrErrs.length) {
      setError("");
      return;
    }
    if (!isPasswordValid(form.password)) {
      setError(
        "Password must be at least 6 characters and include a number, a capital letter, and a special character.",
      );
      return;
    }
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    setError("");
    setLoading(true);
    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        username: form.username,
        address: form.address.trim(),
        phone_number: form.phone_number.trim(),
        password: form.password,
      });
      navigate("/dashboard");
    } catch (err) {
      const d = err.response?.data;
      if (err.response) {
        const msg =
          d?.message || "Registration failed. Please try again.";
        setError(d?.details ? `${msg} — ${d.details}` : msg);
      } else {
        setError(
          "Cannot reach the server. Start the API (npm in backend folder) on port 5000, and run the frontend with `npm run dev` so it can proxy to the API. Check the browser network tab (F12).",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const mismatch = form.confirm && form.password !== form.confirm;
  const nameHasError =
    form.full_name.trim().length > 0 && nameValidationErrors.length > 0;
  const emailHasError =
    form.email.trim().length > 0 && emailValidationErrors.length > 0;
  const usernameHasError =
    form.username.trim().length > 0 && usernameValidationErrors.length > 0;
  const addressHasError =
    form.address.trim().length > 0 && addressValidationErrors.length > 0;
  const passwordHasError =
    form.password.length > 0 && !isPasswordValid(form.password);
  const clientHasError =
    nameHasError ||
    emailHasError ||
    usernameHasError ||
    addressHasError ||
    passwordHasError;

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
              style={{ width: "76px", height: "76px", objectFit: "contain" }}
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

            {(clientHasError || error) && (
              <div style={styles.errorsAbove} role="alert">
                {clientHasError && (
                  <>
                    <p style={styles.errorsAboveTitle}>Please fix the following:</p>
                    <ol style={styles.errorsList}>
                      {clientValidationErrors.map((msg, i) => (
                        <li key={`${i}-${msg.slice(0, 24)}`}>{msg}</li>
                      ))}
                    </ol>
                  </>
                )}
                {error && (
                  <p
                    style={{
                      ...styles.apiErrorInline,
                      marginTop: clientHasError ? 10 : 0,
                    }}
                  >
                    ⚠️ {error}
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Full Name <span style={styles.req}>*</span>
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    borderColor: nameHasError ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={styles.inputIcon}>👤</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, full_name: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Email Address <span style={styles.req}>*</span>
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    borderColor: emailHasError ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={styles.inputIcon}>✉️</span>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="you@gmail.com"
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
                <div
                  style={{
                    ...styles.inputRow,
                    borderColor: usernameHasError ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={styles.inputIcon}>🏷️</span>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="jaceen.jowak"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={form.username}
                    onChange={set("username")}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Address <span style={styles.req}>*</span>
                </label>
                <div
                  style={{
                    ...styles.textareaRow,
                    borderColor: addressHasError ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={{ ...styles.inputIcon, alignSelf: "flex-start", paddingTop: "12px" }}>
                    📍
                  </span>
                  <textarea
                    style={styles.textarea}
                    placeholder="Purok 5 San Isidro Street, Cabadbaran City"
                    value={form.address}
                    onChange={set("address")}
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Phone number */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Phone number <span style={styles.req}>*</span>
                </label>
                <div style={styles.inputRow}>
                  <span style={styles.inputIcon}>📞</span>
                  <input
                    style={styles.input}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    placeholder="Digits only, e.g. 09123456789"
                    value={form.phone_number}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setForm((f) => ({ ...f, phone_number: digits }));
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Password <span style={styles.req}>*</span>
                </label>
                <div
                  style={{
                    ...styles.inputRow,
                    borderColor: passwordHasError ? "#e74c3c" : "#d0d0d0",
                  }}
                >
                  <span style={styles.inputIcon}>🔒</span>
                  <input
                    style={styles.input}
                    type={showPass ? "text" : "password"}
                    placeholder="Mix of letters, numbers, symbols"
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
                {passwordFieldError && (
                  <p style={styles.passwordErrorMsg} role="alert" aria-live="polite">
                    {passwordFieldError}
                  </p>
                )}
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

              <button
                type="submit"
                style={{
                  ...styles.submitBtn,
                  opacity: loading || clientHasError ? 0.65 : 1,
                }}
                disabled={loading || clientHasError}
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
    width: "136px",
    height: "136px",
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
  errorsAbove: {
    background: "#fff5f5",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  errorsAboveTitle: {
    margin: "0 0 8px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#c0392b",
  },
  errorsList: {
    margin: 0,
    paddingLeft: "18px",
    color: "#a93226",
    fontSize: "12px",
    lineHeight: 1.55,
  },
  apiErrorInline: {
    margin: 0,
    fontSize: "13px",
    color: "#c0392b",
    fontWeight: 600,
  },
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
  textareaRow: {
    display: "flex",
    alignItems: "stretch",
    background: "#fff",
    border: "1.5px solid #d0d0d0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  textarea: {
    flex: 1,
    minHeight: "72px",
    padding: "11px 12px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "transparent",
    color: "#333",
    resize: "vertical",
    boxSizing: "border-box",
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
  passwordErrorMsg: {
    margin: "8px 0 0",
    fontSize: "12px",
    fontWeight: 600,
    color: "#c0392b",
    lineHeight: 1.45,
  },
  fieldErr: { color: "#e74c3c", fontSize: "11px", margin: "4px 0 0" },
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
