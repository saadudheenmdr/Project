import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
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

  const registerUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await API.post("auth/register/", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration Failed. Please try again.";

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card-layout">
        {/* Left Side - Brand Banner */}
        <div className="auth-banner register-banner">
          <div className="banner-content">
            <Link to="/" className="brand-logo">
              <img 
                src="/pro_logo.png" 
                alt="BookMyService Logo" 
                style={{ width: '35px', height: 'auto', marginRight: '8px', verticalAlign: 'middle' }} 
              />
              BookMyService
            </Link>
            <h2>Join Kerala's Most Trusted Auto Network</h2>
            <p>Create your free account today and experience hassle-free vehicle maintenance with upfront pricing and zero hidden fees.</p>
            
            <div className="banner-features">
              <div className="feature-item">
                <span className="feature-icon">✔</span>
                <span>Fast 2-minute digital vehicle registration</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✔</span>
                <span>Automated maintenance reminders & alerts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✔</span>
                <span>Exclusive access to verified service centers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="form-header">
            <h3>Create an Account</h3>
            <p>Fill in your details to get started with BookMyService</p>
          </div>

          <form onSubmit={registerUser} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                required
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile"
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimum 3 characters"
                  required
                  minLength="3"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="role">Register As</label>
                <select id="role" name="role" value={form.role} onChange={handleChange} required>
                  <option value="user">Vehicle Owner</option>
                  <option value="admin">Service Center</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
            <Link to="/" className="back-home-link">← Return to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}