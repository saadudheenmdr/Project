import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios"; // Imported the API instance
import "../styles/CustomerPages.css";

export default function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state for network calls
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    number: "",
    year: "",
  });

  const [editingId, setEditingId] = useState(null);

  // 1. READ: Fetch real vehicles from the database on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("vehicles/");
      const responseData = response.data.results ? response.data.results : response.data;
      setVehicles(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      console.error("Failed to fetch vehicles from server:", error);
      alert("Could not load your vehicles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 2. CREATE & UPDATE: Submit changes directly to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // PUT/PATCH request to update the vehicle on the backend
        const response = await API.put(`vehicles/${editingId}/`, formData);
        
        setVehicles(
          vehicles.map((vehicle) =>
            vehicle.id === editingId ? response.data : vehicle
          )
        );
        setEditingId(null);
        alert("Vehicle updated successfully!");
      } else {
        // POST request to create a real vehicle in the database
        const response = await API.post("vehicles/", formData);
        
        // The backend will return the real database auto-incremented ID (e.g., 1, 2, 3)
        setVehicles([...vehicles, response.data]);
        alert("Vehicle added successfully!");
      }

      // Reset form fields
      setFormData({
        brand: "",
        model: "",
        number: "",
        year: "",
      });
    } catch (error) {
      console.error("Error saving vehicle:", error.response?.data || error.message);
      alert(`Failed to save vehicle: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id);

    setFormData({
      brand: vehicle.brand,
      model: vehicle.model,
      number: vehicle.number || vehicle.license_plate, // Fallback check for field names
      year: vehicle.year,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 3. DELETE: Remove vehicle from backend database
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await API.delete(`vehicles/${id}/`);
        setVehicles(vehicles.filter((v) => v.id !== id));
        alert("Vehicle deleted successfully.");
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert("Failed to delete vehicle from server.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>My Vehicles</h2>

        <div className="vehicle-form">
          <h3>{editingId ? "Edit Vehicle" : "Add New Vehicle"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="model"
              placeholder="Model"
              value={formData.model}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="number"
              placeholder="Vehicle Number"
              value={formData.number}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <button type="submit" className="save-btn">
              {editingId ? "Update Vehicle" : "Add Vehicle"}
            </button>
          </form>
        </div>

        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Vehicle Number</th>
              <th>Year</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading your vehicles...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No vehicles added yet.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.number || vehicle.license_plate}</td>
                  <td>{vehicle.year}</td>

                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(vehicle)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}