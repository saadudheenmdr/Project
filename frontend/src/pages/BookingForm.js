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
    requestPickup: false,
    requestDropoff: false,
    pickupLocation: "",
    dropoffLocation: "",
    sameAsPickup: false,
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
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      let updatedForm = { ...prev, [name]: inputValue };

      if (name === "sameAsPickup" && checked) {
        updatedForm.dropoffLocation = prev.pickupLocation;
      } else if (name === "pickupLocation" && prev.sameAsPickup) {
        updatedForm.dropoffLocation = value; 
      } else if (name === "sameAsPickup" && !checked) {
        updatedForm.dropoffLocation = ""; 
      }

      return updatedForm;
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
        status: "Pending",
        request_pickup: form.requestPickup,
        request_dropoff: form.requestDropoff,
        pickup_location: form.requestPickup ? form.pickupLocation : "",
        dropoff_location: form.requestDropoff ? form.dropoffLocation : "",
      };

      await API.post("appointments/", payload);
      alert("Appointment Booked Successfully!");

      setForm({
        vehicle: "",
        service: "",
        date: "",
        time: "",
        notes: "",
        requestPickup: false,
        requestDropoff: false,
        pickupLocation: "",
        dropoffLocation: "",
        sameAsPickup: false,
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
            <option value="Water Service">Water Service</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Brake Service">Brake Service</option>
            <option value="General Service">General Service</option>
            <option value="Battery Check">Battery Check</option>
            <option value="Wheel Alignment">Wheel Alignment</option>
            <option value="Other">Other</option>  
          </select>

          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <label>Time</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} required />

          {/* ----- NEW: VALET SECTION ----- */}
          <div className="valet-section">
            <h3>Pick-up & Drop-off Services</h3>
            
            {/* Pick-up Checkbox */}
            <label className="checkbox-group">
              <input 
                type="checkbox" 
                name="requestPickup" 
                checked={form.requestPickup} 
                onChange={handleChange} 
              />
              Request Pick-up (Driver collects the vehicle from you)
            </label>

            {/* Show Pick-up Location if checked */}
            {form.requestPickup && (
              <div className="location-input-group">
                <label>Pick-up Address</label>
                <textarea 
                  name="pickupLocation" 
                  rows="2" 
                  value={form.pickupLocation} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter full address for pick-up"
                />
              </div>
            )}

            {/* Drop-off Checkbox */}
            <label className="checkbox-group">
              <input 
                type="checkbox" 
                name="requestDropoff" 
                checked={form.requestDropoff} 
                onChange={handleChange} 
              />
              Request Drop-off (Driver returns the vehicle to you)
            </label>

            {/* Show Drop-off Location if checked */}
            {form.requestDropoff && (
              <div className="location-input-group">
                
                {/* Show "Same as Pick-up" ONLY if Pick-up is also requested */}
                {form.requestPickup && (
                   <label className="checkbox-group" style={{ marginBottom: "10px" }}>
                     <input 
                       type="checkbox" 
                       name="sameAsPickup" 
                       checked={form.sameAsPickup} 
                       onChange={handleChange} 
                     />
                     Drop-off location is the same as Pick-up
                   </label>
                )}

                <label>Drop-off Address</label>
                <textarea 
                  name="dropoffLocation" 
                  rows="2" 
                  value={form.dropoffLocation} 
                  onChange={handleChange} 
                  required 
                  disabled={form.sameAsPickup}
                  placeholder="Enter full address for drop-off"
                />
              </div>
            )}
          </div>
          {/* ----- END VALET SECTION ----- */}

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