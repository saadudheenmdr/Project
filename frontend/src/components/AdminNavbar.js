import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/1.css";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    navigate("/login"); 
  };

  return (
    <nav className="navbar">
      <h2>BookMyService Admin</h2>

      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login">Login</Link> 
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {/* Added Admin specific links */}
            <Link to="/admin-dashboard">Admin Dashboard</Link>
            
            <Link to="/admin-appointments">Admin Appointments</Link>

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