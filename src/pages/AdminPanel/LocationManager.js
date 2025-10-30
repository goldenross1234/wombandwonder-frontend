import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    contact: "",
    hours: "",
  });

  const fetchLocations = () => {
    axios
      .get("http://127.0.0.1:8000/api/locations/")
      .then((res) => setLocations(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/api/locations/", form)
      .then(() => {
        fetchLocations();
        setForm({ name: "", address: "", contact: "", hours: "" });
      })
      .catch(console.error);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this location?")) {
      axios
        .delete(`http://127.0.0.1:8000/api/locations/${id}/`)
        .then(fetchLocations)
        .catch(console.error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-10">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">Manage Locations</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-10 max-w-xl"
      >
        <label className="block mb-2 font-semibold">Clinic Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />

        <label className="block mb-2 font-semibold">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />

        <label className="block mb-2 font-semibold">Contact</label>
        <input
          type="text"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />

        <label className="block mb-2 font-semibold">Operating Hours</label>
        <input
          type="text"
          value={form.hours}
          onChange={(e) => setForm({ ...form, hours: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />

        <button className="bg-pink-600 text-white py-2 px-6 rounded-full hover:bg-pink-700">
          Add Location
        </button>
      </form>

      <div className="bg-white rounded-xl shadow p-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="border-b p-3 flex justify-between items-start"
          >
            <div>
              <h3 className="font-bold">{loc.name}</h3>
              <p className="text-sm text-gray-600">{loc.address}</p>
              <p className="text-sm text-gray-600">{loc.contact}</p>
              <p className="text-sm text-gray-600">{loc.hours}</p>
            </div>
            <button
              onClick={() => handleDelete(loc.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
