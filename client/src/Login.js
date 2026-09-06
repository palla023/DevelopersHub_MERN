import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { useToast } from "./Toast";
import "./Register.css";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, formData);
      localStorage.setItem("token", res.data.token);
      showToast("Welcome back! Successfully signed in.", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response && typeof err.response.data === "string"
          ? err.response.data
          : "Invalid email or password. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-badge">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to your DevelopersHub account to browse developers and discussions
          </p>
        </div>

        <form className="auth-form" onSubmit={submitHandler}>
          <div>
            <label className="input-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-envelope input-icon"></i>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                name="email"
                value={email}
                onChange={changeHandler}
                className="modern-input"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-key input-icon"></i>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                minLength="6"
                className="modern-input"
                value={password}
                onChange={changeHandler}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-modern-primary btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Signing In...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?
          <Link to="/register" className="auth-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
