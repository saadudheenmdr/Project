import React, { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginPayload = {
      username: form.username,
      password: form.password,
      role: form.role,
    };

    try {
      const res = await API.post("auth/login/", loginPayload);
      const actualUserRole = res.data.role;

      // Strict role enforcement
      if (actualUserRole && actualUserRole !== form.role) {
        toast.error(`Access Denied: You do not have ${form.role.toUpperCase()} privileges.`);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const userData = {
        username: form.username,
        role: actualUserRole || form.role,
      };
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login Success");

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid Username, Password, or Role";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side - Brand Banner */}
        <div className="auth-banner login-banner">
          <div className="banner-content">
            <Link to="/" className="brand-logo">
              <img 
                src="/pro_logo.png" 
                alt="BookMyService Logo" 
                style={{ width: '35px', height: 'auto', marginRight: '8px', verticalAlign: 'middle' }} 
              />
              BookMyService
            </Link>
            <h2>Welcome Back to Smart Vehicle Care</h2>
            <p>Access your dashboard to track ongoing services, view maintenance history, and book new appointments in seconds.</p>
            
            <div className="banner-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Real-time service status updates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛡️</span>
                <span>100% secure data & payment protection</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <span>Direct communication with certified mechanics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <h3>Sign In</h3>
            <p>Please enter your account details to continue</p>
          </div>

          <form onSubmit={loginUser} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Account Type</label>
              <select id="role" name="role" value={form.role} onChange={handleChange} required>
                <option value="user">Vehicle Owner (User)</option>
                <option value="admin">Service Center (Admin)</option>
              </select>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account yet? <Link to="/register">Create one now</Link></p>
            <Link to="/" className="back-home-link">← Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}