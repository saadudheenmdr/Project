import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "../styles/CustomerPages.css";

export default function BookingForm() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingVehicles, setIsFetchingVehicles] = useState(true); 
  const [form, setForm] = useState({
    vehicle: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    const fetchMyVehicles = async () => {
      try {
        const response = await API.get("vehicles/"); 
        const responseData = response.data.results ? response.data.results : response.data;
        setVehicles(Array.isArray(responseData) ? responseData : []);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setIsFetchingVehicles(false);
      }
    };

    fetchMyVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        vehicle: parseInt(form.vehicle, 10), 
        service_type: form.service, 
        service_date: form.date,    
        service_time: form.time,    
        notes: form.notes,
        status: "Pending"
      };

      await API.post("appointments/", payload);
      alert("Appointment Booked Successfully!");

      setForm({
        vehicle: "",
        service: "",
        date: "",
        time: "",
        notes: "",
      });
      
    } catch (error) {
      console.error("Full Backend Error:", error.response?.data || error.message);
      
      const errorData = error.response?.data;
      let errorMsg = "Failed to book appointment. Please try again.";
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.detail) {
          errorMsg = errorData.detail; 
        } else {
          errorMsg = JSON.stringify(errorData); 
        }
      }
      
      alert(`Booking Failed: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Book Service Appointment</h2>

        <form onSubmit={handleSubmit}>
          <label>Vehicle</label>
          <select name="vehicle" value={form.vehicle} onChange={handleChange} required disabled={isFetchingVehicles}>
            <option value="">
              {isFetchingVehicles ? "Loading vehicles..." : "Select Vehicle"}
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} ({vehicle.number || vehicle.license_plate})
              </option>
            ))}
          </select>

          {!isFetchingVehicles && vehicles.length === 0 && (
            <p style={{ color: "red" }}>
              Please add a vehicle first from the My Vehicles page.
            </p>
          )}

          <label>Service Type</label>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">Select Service</option>
            {/* Added explicit value props to match your Django SERVICE_CHOICES perfectly */}
            <option value="Oil Change">Oil Change</option>
            <option value="Brake Service">Brake Service</option>
            <option value="General Service">General Service</option>
            <option value="Battery Check">Battery Check</option>
            <option value="Wheel Alignment">Wheel Alignment</option>
          </select>

          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <label>Time</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} required />

          <label>Additional Notes</label>
          <textarea name="notes" rows="4" value={form.notes} onChange={handleChange} />

          <button type="submit" disabled={vehicles.length === 0 || isLoading || isFetchingVehicles}>
            {isLoading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </>
  );
}