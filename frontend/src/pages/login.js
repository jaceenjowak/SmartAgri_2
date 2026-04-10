import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./login.css";
import logo from "../logo.svg";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", form);

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="login-page">
      <SiteNav />

      <main className="login-main">
        <div className="login-card">

          <div className="left">
            <img src={logo} alt="logo" />
            <h2>SmartAgri Farm</h2>
            <p>Empowering Smart Agriculture</p>
          </div>

          <div className="right">
            <h2>Login</h2>

            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button type="submit">Login</button>
            </form>

            <div className="extra-links">
              <p>
                Don’t have an account?{" "}
                <Link to="/register">register</Link>
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}