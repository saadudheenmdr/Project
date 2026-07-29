import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import "../styles/PendingServices.css"; 

export default function PendingServices() {
  const navigate = useNavigate();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch fresh data
  const fetchPending = async () => {
    try {
      const res = await API.get("appointments/admin/dashboard-metrics/"); 
      const pendingData = res.data?.lists?.pending || [];
      setPendingList(pendingData);
    } catch (error) {
      console.error("Error fetching pending services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    
   // To auto-refresh every 10 seconds
    const intervalId = setInterval(fetchPending, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Function to approve an appointment
  const handleApprove = async (appointmentId) => {
    try {
      await API.patch(`appointments/admin/appointments/${appointmentId}/status/`, { status: "Approved" });
      fetchPending(); // Refresh the list after status change
    } catch (err) {
      alert("Failed to approve the appointment.");
    }
  };

  // Function to reject an appointment
  const handleReject = async (appointmentId) => {
    try {
      await API.patch(`appointments/admin/appointments/${appointmentId}/status/`, { status: "Rejected" });
      fetchPending(); // Refresh the list after status change
    } catch (err) {
      alert("Failed to reject the appointment.");
    }
  };

  return (
    <div className="pending-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back to Dashboard
      </button>
      
      <h2 className="pending-title">Pending Services</h2>
      
      {loading ? (
        <div className="loading-text">Loading pending services...</div>
      ) : pendingList.length > 0 ? (
        <div className="table-wrapper">
          <table className="pending-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingList.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.customer_name || item.customerName || item.name || "Unknown"}</td>
                  <td>{item.service_type || item.service || "N/A"}</td>
                  <td>{item.service_date || item.date || "N/A"}</td>
                  <td>{item.service_time || item.time || "N/A"}</td>
                  <td>
                    <span className="status-badge-pending">Pending</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-approve" 
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleReject(item.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No pending services found.</div>
      )}
    </div>
  );
}