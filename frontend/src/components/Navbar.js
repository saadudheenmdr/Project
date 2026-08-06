import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

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
    <nav className={styles.navbar}>
      {/* Brand / Logo Area */}
      <Link to="/" className={styles.brand}>
        <img 
          src="/pro_logo.png" 
          alt="BookMyService Logo" 
          className={styles.logoImage} 
        />
        <span className={styles.brandText}>BookMyService</span>
      </Link>

      {/* Navigation Links & Buttons */}
      <div className={styles.navLinks}>
        {!token ? (
          <>
            <Link to="/login" className={`${styles.btn} ${styles.btnOutline}`}>
              Login
            </Link> 
            <Link to="/register" className={`${styles.btn} ${styles.btnPrimary}`}>
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/book-appointment" className={styles.navLink}>
              Book Service
            </Link>
            <Link to="/my-vehicles" className={styles.navLink}>
              My Vehicles
            </Link>
            <Link to="/appointment-history" className={styles.navLink}>
              History
            </Link>
            <Link to="/profile" className={styles.navLink}>
              Profile
            </Link>
            <button onClick={logoutUser} className={`${styles.btn} ${styles.btnLogout}`}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}