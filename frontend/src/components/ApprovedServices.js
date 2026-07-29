import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 
import "../styles/ApprovedServices.css";

export default function ApprovedServices() {
  const navigate = useNavigate();
  const [approvedList, setApprovedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApproved = async () => {
    try {
      // Using the dashboard-metrics API to guarantee we get the exact same admin data
      const res = await API.get("appointments/admin/dashboard-metrics/"); 
      
      // Extract only the approved list from the response
      const approvedData = res.data?.lists?.approved || [];
      setApprovedList(approvedData);
    } catch (error) {
      console.error("Error fetching approved services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
    
    // Auto-refresh every 10 seconds to keep sync with AdminAppointments actions
    const intervalId = setInterval(fetchApproved, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="approved-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        &larr; Back to Dashboard
      </button>
      
      <h2 className="approved-title">Approved Services</h2>
      
      {loading ? (
        <div className="loading-text">Loading approved services...</div>
      ) : approvedList.length > 0 ? (
        <div className="table-wrapper">
          <table className="approved-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                {/* പുതിയ Valet Request കോളം ചേർത്തു */}
                <th>Valet Request</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvedList.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.customer_name || item.customerName || item.name || "Unknown"}</td>
                  <td>{item.service_type || item.service || "N/A"}</td>
                  <td>{item.service_date || item.date || "N/A"}</td>
                  <td>{item.service_time || item.time || "N/A"}</td>
                  
                  {/* Valet വിവരങ്ങൾ കാണിക്കാനുള്ള സെക്ഷൻ */}
                  <td>
                    {item.request_pickup && (
                      <div style={{ fontSize: '13px', marginBottom: '5px', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: 'bold', color: '#0F172A' }}>Pick-up: </span> 
                        {item.pickup_location}
                      </div>
                    )}
                    {item.request_dropoff && (
                      <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: 'bold', color: '#0F172A' }}>Drop-off: </span> 
                        {item.dropoff_location}
                      </div>
                    )}
                    {!item.request_pickup && !item.request_dropoff && (
                      <span style={{ color: '#6c757d', fontSize: '13px' }}>Not Requested</span>
                    )}
                  </td>

                  <td>
                    <span className="status-badge">Approved</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No approved services found.</div>
      )}
    </div>
  );
}