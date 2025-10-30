import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PromoManager() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ title: "", discount: "", start_date: "", end_date: "" });

  const fetchPromos = () => {
    axios.get("http://127.0.0.1:8000/api/promos/").then(res => setPromos(res.data));
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/promos/", form)
      .then(() => {
        fetchPromos();
        setForm({ title: "", discount: "", start_date: "", end_date: "" });
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this promo?"))
      axios.delete(`http://127.0.0.1:8000/api/promos/${id}/`).then(fetchPromos);
  };

  return (
    <div className="min-h-screen bg-pink-50 p-10">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">Manage Promos</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-10 max-w-xl">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <input
          type="number"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <label>Start Date</label>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <label>End Date</label>
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="border rounded-lg p-2 w-full mb-4"
        />
        <button className="bg-pink-600 text-white py-2 px-6 rounded-full hover:bg-pink-700">
          Add Promo
        </button>
      </form>

      <div className="bg-white rounded-xl shadow p-6">
        {promos.map((p) => (
          <div key={p.id} className="border-b p-3 flex justify-between">
            <div>
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600">
                {p.discount}% | {p.start_date} → {p.end_date}
              </p>
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
