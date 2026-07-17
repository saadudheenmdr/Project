import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADDED: For navigation
import API from '../api/axios'; 
import "../styles/AdminPanel.css";

const AppointmentTable = ({ list = [], onApprove, onReject }) => {
  if (list.length === 0) return <p className="no-data-msg">No appointments found.</p>;

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Service</th>
          <th>Time</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {list.map(apt => (
          <tr key={apt.id}>
            <td>{apt.customer_name || "Unknown Customer"}</td>
            <td>{apt.service_type || apt.service}</td>
            <td>{apt.service_date || apt.date} @ {apt.service_time || apt.time}</td>
            <td>
              <span className={`status-badge ${
                apt.status === 'Approved' ? 'status-approved' : 
                apt.status === 'Pending' ? 'status-pending' : 'status-rejected'
              }`}>
                {apt.status}
              </span>
            </td>
            <td>
              {apt.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="approve-btn" onClick={() => onApprove(apt.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => onReject(apt.id)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Reject</button>
                </div>
              ) : (
                <span className="no-action">-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AdminAppointment = () => {
  const navigate = useNavigate(); // ADDED: Hook initialization

  const [data, setData] = useState({
    metrics: { totalBookings: 0, todayBookings: 0, approvedCount: 0, pendingCount: 0, rejectedCount: 0 },
    lists: { today: [], pending: [], approved: [], rejected: [] }
  });
  
  const [currentView, setCurrentView] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('appointments/admin/dashboard-metrics/');
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error loading metrics:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(intervalId); 
  }, []);

  const handleApprove = async (appointmentId) => {
    try {
      await API.patch(`appointments/admin/appointments/${appointmentId}/status/`, { status: "Approved" });
      fetchDashboardData(); 
    } catch (err) {
      alert("Failed to approve the appointment.");
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await API.patch(`appointments/admin/appointments/${appointmentId}/status/`, { status: "Rejected" });
      fetchDashboardData(); 
    } catch (err) {
      alert("Failed to reject the appointment.");
    }
  };

  if (loading) return <div className="admin-container loading-state">Loading Dashboard Data...</div>;
  if (error) return <div className="admin-container error-state">{error}</div>;

  const { metrics = {}, lists = {} } = data;

  return (
    <div className="admin-container">
      {/* ADDED: Header wrapper with navigation button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="admin-title" style={{ margin: 0 }}>Appointment Management</h1>
        <button 
          onClick={() => navigate('/admin-dashboard')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          &larr; Back to Dashboard
        </button>
      </div>
      
      <div className="metrics-grid">
        <div onClick={() => setCurrentView('Overview')} className={`metric-card ${currentView === 'Overview' ? 'active-card' : ''}`}>
          <div className="metric-title">Total Bookings</div>
          <div className="metric-value text-blue">{metrics.totalBookings || 0}</div>
        </div>
        <div onClick={() => setCurrentView('Today')} className={`metric-card ${currentView === 'Today' ? 'active-card' : ''}`}>
          <div className="metric-title">Today's Bookings</div>
          <div className="metric-value text-purple">{metrics.todayBookings || 0}</div>
        </div>
        <div onClick={() => setCurrentView('Pending')} className={`metric-card ${currentView === 'Pending' ? 'active-card' : ''}`}>
          <div className="metric-title">Pending Requests</div>
          <div className="metric-value text-yellow">{metrics.pendingCount || 0}</div>
        </div>
        <div onClick={() => setCurrentView('Approved')} className={`metric-card ${currentView === 'Approved' ? 'active-card' : ''}`}>
          <div className="metric-title">Approved Services</div>
          <div className="metric-value text-green">{metrics.approvedCount || 0}</div>
        </div>
      </div>

      <div className="content-area">
        <h2 className="section-subtitle">{currentView} List</h2>
        
        {currentView === 'Overview' && (
          <div className="overview-instruction">
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Select a metric card above to drill down into active status groups, or jump right into your main validation queue below.
            </p>
            <h3 className="sub-queue-title">Urgent Action Required (Pending)</h3>
            <AppointmentTable list={lists.pending} onApprove={handleApprove} onReject={handleReject} />
          </div>
        )}

        {currentView === 'Today' && <AppointmentTable list={lists.today} onApprove={handleApprove} onReject={handleReject} />}
        {currentView === 'Pending' && <AppointmentTable list={lists.pending} onApprove={handleApprove} onReject={handleReject} />}
        {currentView === 'Approved' && <AppointmentTable list={lists.approved} onApprove={handleApprove} onReject={handleReject} />}
      </div>
    </div>
  );
};

export default AdminAppointment;