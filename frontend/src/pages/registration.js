import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./register.css";
import logo from "../assets/logo.png";

export default function Registration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fname: "",
    mname: "",
    lname: "",
    extname: "",
    sex: "",
    bday: "",
    age: "",
    email: "",
    purok: "",
    barangay: "",
    city: "",
    province: "",
    country: "",
    zip: "",
    username: "",
    password: "",
    repass: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [strength, setStrength] = useState("");
  const [match, setMatch] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRepass, setShowRepass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBirthdate = (e) => {
    const birthdate = new Date(e.target.value);
    const today = new Date();

    let age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    setForm({ ...form, bday: e.target.value, age });
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (password.length >= 14) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    setStrength(password ? texts[Math.min(strength, 4)] : "");
  };

  const checkMatch = (repass) => {
    if (!repass) return setMatch("");
    setMatch(repass === form.password ? "✓" : "✗");
  };

  // ✅ FIXED: now INSIDE component
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.repass) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 12 || form.password.length > 16) {
      setError("Password must be between 12–16 characters!");
      return;
    }

    try {
      const payload = {
        first_name: form.fname,
        middle_name: form.mname,
        last_name: form.lname,
        extension_name: form.extname,
        sex: form.sex,
        birthdate: form.bday,
        age: form.age,
        email: form.email,
        purok: form.purok,
        barangay: form.barangay,
        city: form.city,
        province: form.province,
        country: form.country,
        zip_code: form.zip,
        username: form.username,
        password: form.password
      };

      const res = await axios.post("http://localhost:5000/register", payload);

      setSuccess(res.data.message || "Registration successful!");
      setError("");

      setForm({
        fname: "",
        mname: "",
        lname: "",
        extname: "",
        sex: "",
        bday: "",
        age: "",
        email: "",
        purok: "",
        barangay: "",
        city: "",
        province: "",
        country: "",
        zip: "",
        username: "",
        password: "",
        repass: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setSuccess("");
    }
  };
  return (
    <div className="register-page">
      <SiteNav />

      {/* REGISTER — centered card on dark green */}
      <main className="register-main">
      <div className="register-container">

        {/* LEFT */}
        <div className="left-section">
          <img src={logo} alt="SmartAgri Logo" className="logo-img" />
          <h1>SmartAgri Farm</h1>
          <p>Empowering Smart Agriculture</p>
        </div>

        {/* RIGHT */}
        <div className="right-section">
          <h2>Create Your Account</h2>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="register-grid">

              <input name="fname" placeholder="First Name" value={form.fname} onChange={handleChange} required />
              <input name="mname" placeholder="Middle Name" value={form.mname} onChange={handleChange} />
              <input name="lname" placeholder="Last Name" value={form.lname} onChange={handleChange} required />
              <input name="extname" placeholder="Extension" value={form.extname} onChange={handleChange} />

              <select name="sex" value={form.sex} onChange={handleChange} required>
                <option value="">Sex</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>

              <input type="date" name="bday" value={form.bday} onChange={handleBirthdate} required />
              <input value={form.age} readOnly placeholder="Age" />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />

              <input name="purok" placeholder="Purok" value={form.purok} onChange={handleChange} required />
              <input name="barangay" placeholder="Barangay" value={form.barangay} onChange={handleChange} required />
              <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <input name="province" placeholder="Province" value={form.province} onChange={handleChange} required />
              <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />
              <input name="zip" placeholder="Zip Code" value={form.zip} onChange={handleChange} required />

              <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />

              {/* Password */}
              <div className="password-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => {
                    handleChange(e);
                    checkPasswordStrength(e.target.value);
                  }}
                  required
                />
                <span onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </span>
              </div>
              <small>{strength}</small>

              {/* Confirm Password */}
              <div className="password-wrapper">
                <input
                  type={showRepass ? "text" : "password"}
                  name="repass"
                  placeholder="Confirm Password"
                  value={form.repass}
                  onChange={(e) => {
                    handleChange(e);
                    checkMatch(e.target.value);
                  }}
                  required
                />
                <span onClick={() => setShowRepass(!showRepass)}>
                  {showRepass ? "🙈" : "👁️"}
                </span>
              </div>
              <small>{match}</small>

            </div>

            <button type="submit">Register</button>
          </form>

          <p className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      </main>
    </div>
  );
}