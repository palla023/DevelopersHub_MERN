import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "./config";
import { useToast } from "./Toast";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    mobile: "",
    skill: "",
    experience: "Full Stack Developer",
    bio: "",
    password: "",
    confirmpassword: "",
  });

  const {
    fullname,
    email,
    mobile,
    skill,
    experience,
    bio,
    password,
    confirmpassword,
  } = formData;

  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      showToast("Passwords do not match! Please check and try again.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, formData);
      showToast(res.data || "Account created successfully! Please sign in.", "success");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response && typeof err.response.data === "string"
          ? err.response.data
          : "Registration failed. Please verify your details.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "560px" }}>
        <div className="auth-header">
          <div className="auth-icon-badge">
            <i className="fa-solid fa-user-plus"></i>
          </div>
          <h1 className="auth-title">Create Developer Profile</h1>
          <p className="auth-subtitle">
            Join DevelopersHub to showcase your work and connect with peers
          </p>
        </div>

        <form className="auth-form" onSubmit={submitHandler}>
          <div>
            <label className="input-label" htmlFor="fullname">
              Full Name *
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-user input-icon"></i>
              <input
                id="fullname"
                type="text"
                placeholder="e.g. Alex Rivera"
                name="fullname"
                value={fullname}
                onChange={changeHandler}
                className="modern-input"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className="input-label" htmlFor="email">
                Email Address *
              </label>
              <div className="input-with-icon">
                <i className="fa-solid fa-envelope input-icon"></i>
                <input
                  id="email"
                  type="email"
                  placeholder="alex@domain.com"
                  name="email"
                  value={email}
                  onChange={changeHandler}
                  className="modern-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="mobile">
                Phone / Mobile *
              </label>
              <div className="input-with-icon">
                <i className="fa-solid fa-phone input-icon"></i>
                <input
                  id="mobile"
                  type="text"
                  placeholder="+1 555-0199"
                  name="mobile"
                  value={mobile}
                  onChange={changeHandler}
                  className="modern-input"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="skill">
              Skills (Comma Separated) *
            </label>
            <div className="input-with-icon">
              <i className="fa-solid fa-code input-icon"></i>
              <input
                id="skill"
                type="text"
                placeholder="e.g. React, Node.js, Python, TypeScript, Docker"
                name="skill"
                value={skill}
                onChange={changeHandler}
                className="modern-input"
                required
              />
            </div>
            <span className="input-helper">
              Separate skills with commas to generate filterable skill tags.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className="input-label" htmlFor="experience">
                Primary Role / Title
              </label>
              <input
                id="experience"
                type="text"
                placeholder="e.g. Senior Frontend Dev"
                name="experience"
                value={experience}
                onChange={changeHandler}
                className="modern-input"
              />
            </div>
            <div>
              <label className="input-label" htmlFor="bio">
                Short Bio
              </label>
              <input
                id="bio"
                type="text"
                placeholder="Passionate about UI & APIs"
                name="bio"
                value={bio}
                onChange={changeHandler}
                className="modern-input"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className="input-label" htmlFor="password">
                Password *
              </label>
              <div className="input-with-icon">
                <i className="fa-solid fa-key input-icon"></i>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars"
                  name="password"
                  minLength="6"
                  className="modern-input"
                  value={password}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label" htmlFor="confirmpassword">
                Confirm Password *
              </label>
              <div className="input-with-icon">
                <i className="fa-solid fa-check-double input-icon"></i>
                <input
                  id="confirmpassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  name="confirmpassword"
                  minLength="6"
                  className="modern-input"
                  value={confirmpassword}
                  onChange={changeHandler}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: "0.85rem",
                cursor: "pointer",
                padding: "2px 0",
              }}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>{" "}
              {showPassword ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <button
            type="submit"
            className="btn-modern-primary btn-auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Creating Account...
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket"></i> Register Profile
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;