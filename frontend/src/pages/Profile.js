import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Kept your layout
import API from "../api/axios";
import "../styles/CustomerPages.css";

export default function Profile() {
  // ⚡ Deleted the unused navigate variable from here

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("auth/profile/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
      alert("Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    alert("Edit Profile feature coming soon.");
    // Later you can use:
    // navigate("/profile/edit");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>Loading Profile...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>My Profile</h2>

        <div className="profile-card">
          <h3>{user.username}</h3>

          <hr />

          <p>
            <strong>Username :</strong> {user.username}
          </p>

          <p>
            <strong>Email :</strong> {user.email}
          </p>

          <p>
            <strong>Phone :</strong> {user.phone}
          </p>

          <button
            className="edit-btn"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}