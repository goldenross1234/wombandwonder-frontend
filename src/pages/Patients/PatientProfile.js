// src/pages/Patients/PatientProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export default function PatientProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get(`${API_URL}/profile/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div>
      <h2 style={{ color: "#e91e63" }}>My Profile</h2>
      <p><b>Username:</b> {profile.username}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Role:</b> {profile.role}</p>
    </div>
  );
}
