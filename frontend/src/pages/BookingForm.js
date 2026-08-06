import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import "../styles/CustomerPages.css";
import { SERVICES_DATA } from "../data/ServicesData"; 

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
    // New states for At-Home Service
    requestHomeService: false,
    homeServiceAddress: "",
    homeServiceLocation: "",
  });

  useEffect(() => {
    const fetchMyVehicles = async () => {
      try {
        const response = await API.get("vehicles/");
        const responseData = response.data.results
          ? response.data.results
          : response.data;
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

      // Handle Valet same location logic
      if (name === "sameAsPickup" && checked) {
        updatedForm.dropoffLocation = prev.pickupLocation;
      } else if (name === "pickupLocation" && prev.sameAsPickup) {
        updatedForm.dropoffLocation = value;
      } else if (name === "sameAsPickup" && !checked) {
        updatedForm.dropoffLocation = "";
      }

      // If Home Service is checked, disable and clear Pick-up/Drop-off
      if (name === "requestHomeService" && checked) {
        updatedForm.requestPickup = false;
        updatedForm.requestDropoff = false;
        updatedForm.pickupLocation = "";
        updatedForm.dropoffLocation = "";
        updatedForm.sameAsPickup = false;
      }

      // If Pick-up/Drop-off is checked, disable and clear Home Service
      if ((name === "requestPickup" || name === "requestDropoff") && checked) {
        updatedForm.requestHomeService = false;
        updatedForm.homeServiceAddress = "";
        updatedForm.homeServiceLocation = "";
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
        
        // Valet fields
        request_pickup: form.requestPickup,
        request_dropoff: form.requestDropoff,
        pickup_location: form.requestPickup ? form.pickupLocation : "",
        dropoff_location: form.requestDropoff ? form.dropoffLocation : "",

        // Home Service fields
        request_home_service: form.requestHomeService,
        home_service_address: form.requestHomeService ? form.homeServiceAddress : "",
        home_service_location: form.requestHomeService ? form.homeServiceLocation : "",
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
        requestHomeService: false,
        homeServiceAddress: "",
        homeServiceLocation: "",
      });
    } catch (error) {
      console.error(
        "Full Backend Error:",
        error.response?.data || error.message
      );

      const errorData = error.response?.data;
      let errorMsg = "Failed to book appointment. Please try again.";

      if (errorData) {
        if (typeof errorData === "string") {
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

  const selectedServiceDetails = form.service ? SERVICES_DATA[form.service] : null;

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Book Service Appointment</h2>

        <form onSubmit={handleSubmit}>
          <label>Vehicle</label>
          <select
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            required
            disabled={isFetchingVehicles}
          >
            <option value="">
              {isFetchingVehicles ? "Loading vehicles..." : "Select Vehicle"}
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model} (
                {vehicle.number || vehicle.license_plate})
              </option>
            ))}
          </select>

          {!isFetchingVehicles && vehicles.length === 0 && (
            <p style={{ color: "red" }}>
              Please add a vehicle first from the My Vehicles page.
            </p>
          )}

          <label>Service Type</label>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            required
          >
            <option value="">Select Service</option>
            {Object.keys(SERVICES_DATA).map((serviceName) => (
              <option key={serviceName} value={serviceName}>
                {serviceName}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {/* ----- SERVICE DETAILS SECTION ----- */}
          {selectedServiceDetails && (
            <div className="service-details-card">
              <div className="service-details-header">
                <h3 className="service-title">{form.service}</h3>
                <div className="service-price-info">
                  <span className="service-duration">
                    ⏱ {selectedServiceDetails.duration}
                  </span>
                  <div>
                    {selectedServiceDetails.originalPrice && (
                      <span className="service-original-price">
                        {selectedServiceDetails.originalPrice}
                      </span>
                    )}
                    <span className="service-price">
                      {selectedServiceDetails.price}
                    </span>
                  </div>
                </div>
              </div>

              <ul className="service-features">
                {selectedServiceDetails.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <div className="service-inclusions">
                {selectedServiceDetails.inclusions.map((inclusion, idx) => (
                  <div key={idx} className="inclusion-item">
                    <span className="check-icon">✓</span>
                    {inclusion}
                  </div>
                ))}
              </div>
            </div>
          )}

          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <label>Time</label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          {/* ----- DELIVERY OPTIONS SECTION ----- */}
          <div className="valet-section" style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '15px', color: '#0F172A' }}>Service Delivery Options</h3>

            {/* At-Home Service Option */}
            <label className="checkbox-group" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#2563EB' }}>
              <input
                type="checkbox"
                name="requestHomeService"
                checked={form.requestHomeService}
                onChange={handleChange}
              />
              Request Doorstep / At-Home Service (Mechanic visits you)
            </label>

            {form.requestHomeService && (
              <div className="location-input-group" style={{ marginLeft: '25px', marginBottom: '20px' }}>
                <label>Service Address</label>
                <textarea
                  name="homeServiceAddress"
                  rows="2"
                  value={form.homeServiceAddress}
                  onChange={handleChange}
                  required
                  placeholder="Enter full address for the home service"
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label>Location / Landmark</label>
                <input
                  type="text"
                  name="homeServiceLocation"
                  value={form.homeServiceLocation}
                  onChange={handleChange}
                  required
                  placeholder="E.g., Near City Mall, or Map Link"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            {/* Divider if Home service is not checked */}
            {!form.requestHomeService && (
              <div style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>OR choose garage drop-off/pick-up</span>
              </div>
            )}

            {/* Pick-up / Drop-off Options (Hidden if Home Service is selected) */}
            {!form.requestHomeService && (
              <>
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    name="requestPickup"
                    checked={form.requestPickup}
                    onChange={handleChange}
                  />
                  Request Pick-up (We collect the vehicle from you)
                </label>

                {form.requestPickup && (
                  <div className="location-input-group" style={{ marginLeft: '25px' }}>
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

                <label className="checkbox-group" style={{ marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    name="requestDropoff"
                    checked={form.requestDropoff}
                    onChange={handleChange}
                  />
                  Request Drop-off (We return the vehicle to you)
                </label>

                {form.requestDropoff && (
                  <div className="location-input-group" style={{ marginLeft: '25px' }}>
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
                      required={!form.sameAsPickup}
                      disabled={form.sameAsPickup}
                      placeholder="Enter full address for drop-off"
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {/* ----- END DELIVERY OPTIONS SECTION ----- */}

          <label style={{ marginTop: '20px' }}>Additional Notes</label>
          <textarea
            name="notes"
            rows="4"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any specific issues or requests?"
          />

          <button
            type="submit"
            disabled={vehicles.length === 0 || isLoading || isFetchingVehicles}
            style={{ marginTop: '20px' }}
          >
            {isLoading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </>
  );
}