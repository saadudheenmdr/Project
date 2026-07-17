import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios"; 
import "../styles/CustomerPages.css";

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 1. Added error state for better UI feedback

  useEffect(() => {
    const fetchMyHistory = async () => {
      try {
        // 2. Updated endpoint to "appointments/" to likely resolve the previous 404 error.
        // Standard REST APIs typically use the base endpoint for the list view.
        const response = await API.get("appointments/"); 
        
        // 3. Handle paginated data just in case the backend wraps the array in 'results'
        const responseData = response.data.results ? response.data.results : response.data;
        
        // Ensure we are definitely setting an array to prevent .map() crashes
        setAppointments(Array.isArray(responseData) ? responseData : []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to load appointments. Please try again later."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchMyHistory();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Appointment History</h2>

        {loading ? (
           <p>Loading history...</p>
        ) : error ? (
           <p className="error-text">{error}</p> /* 4. Render error if request fails */
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item) => (
                <tr key={item.id}>
                  {/* 5. Added optional chaining (?.) and fallbacks to prevent crashes if data is missing */}
                  <td>{item?.vehicle?.name || item?.vehicle || "N/A"}</td>
                  <td>{item?.service_type || item?.service || "N/A"}</td>
                  <td>{item?.service_date || item?.date || "N/A"}</td>
                  <td>{item?.service_time || item?.time || "N/A"}</td>
                  <td>{item?.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}