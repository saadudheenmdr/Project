import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // Explicitly route to the login page on logout
    navigate("/login"); 
  };

  return (
    <nav className="navbar">
      <h2>BookMyService</h2>

      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login">Login</Link> 
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {/* FIXED: Lowercased "dashboard" to follow standard routing conventions */}
            <Link to="/dashboard">Dashboard</Link>

            {/* FIXED: Removed the space to prevent routing failure and false "logouts" */}
            <Link to="/book-appointment">
              Book Appointment
            </Link>

            <Link to="/my-vehicles">
              My Vehicles
            </Link>

            <Link to="/appointment-history">
              Appointment History
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <button
              onClick={logoutUser}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "5px",
                cursor: "pointer" 
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}