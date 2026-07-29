import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Stats fetch cheyyunna function
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
    
    // Oru 10 seconds koodumbol auto refresh aavan
    const intervalId = setInterval(fetchStats, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login"); 
  };

  if (loading) return <h2>Loading Dashboard...</h2>;

  return (
      <div className="admin-container" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h1>Admin Dashboard</h1>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {/* Manage Appointments Button */}
            <button 
              onClick={() => navigate('/admin-appointments')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Manage Appointments
            </button>

            {/* Pending Services Button (NEW) */}
            <button 
              onClick={() => navigate('/pending-services')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#f59e0b', // Yellowish-orange color for pending
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Pending Services
            </button>

            {/* Approved Services Button */}
            <button 
              onClick={() => navigate('/approved-services')}
              style={{
                padding: '10px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Approved Services
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 15px',
                backgroundColor: '#dc3545',
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