import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import API from "../api/axios"; 
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("appointments/admin/dashboard-metrics/");
      if (res.data && res.data.metrics) {
        setStats(res.data.metrics);
      } else {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh stats every 10 seconds to catch new bookings live
    const intervalId = setInterval(fetchStats, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // ADDED: Logout handler to clear auth storage and redirect
  const handleLogout = () => {
    // Clear user tokens/session data (adjust key if you use sessionStorage or specific token names)
    localStorage.clear(); 
    navigate("/login"); // Redirect to your login route
  };

  if (loading) return <h2>Loading Dashboard...</h2>;

  return (
    <div className="admin-container">
      {/* Header wrapper with flexbox layout for the action buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Dashboard</h1>
        
        {/* ADDED: Button container to hold both buttons with spacing */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate('/admin-appointments')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Manage Appointments &rarr;
          </button>

          {/* ADDED: Logout Button */}
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545', // Danger red color for logout
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Appointments</h3>
          <p>{stats.totalBookings || stats.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Bookings</h3>
          <p>{stats.todayBookings || stats.today || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats.pendingCount || stats.pending || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Approved</h3>
          <p>{stats.approvedCount || stats.approved || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Rejected</h3>
          <p>{stats.rejectedCount || stats.rejected || 0}</p>
        </div>
      </div>
    </div>
  );
}