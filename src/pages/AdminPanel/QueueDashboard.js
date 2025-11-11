import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueDashboard() {
  const [queue, setQueue] = useState([]);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    age: "",
    notes: "",
    priority: "regular",
  });

  // ✅ Load queue data
  const fetchQueue = async () => {
    const res = await axios.get(`${API}/queue/`);
    setQueue(res.data);
  };

  useEffect(() => {
    if (!started) return; // prevent loading before day starts
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, [started]);

  // ✅ Handle form change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/queue/`, form);

      setForm({ name: "", age: "", notes: "", priority: "regular" });
      fetchQueue();
    } catch (err) {
      console.error(err);
      alert("Error adding patient!");
    }
  };

  // ✅ Update status
  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/queue/${id}/`, { status });
    fetchQueue();
  };

  // ✅ DELETE queue entry
  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this queue entry?")) return;
    await axios.delete(`${API}/queue/${id}/`);
    fetchQueue();
  };

  // ✅ Call next patient
  const callNext = () => {
    const waiting = queue.filter((q) => q.status === "waiting");
    if (waiting.length === 0) return alert("No waiting patients!");

    const next =
      waiting.find((q) => q.priority === "priority") || waiting[0];

    updateStatus(next.id, "serving");
  };

  // ✅ "Start The Day" — loading screen
  const startDay = () => {
    let p = 0;
    const timer = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setStarted(true);
      }
    }, 80);
  };

  // ✅ BEFORE day starts → show loading UI
  if (!started) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#ffe6f0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "25px",
        }}
      >
        {progress === 0 ? (
          <button
            onClick={startDay}
            style={{
              padding: "18px 50px",
              fontSize: "26px",
              background: "#d81b60",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            Start the Day
          </button>
        ) : (
          <>
            <h2 style={{ color: "#d81b60" }}>Loading Queue System…</h2>

            <div
              style={{
                width: "450px",
                height: "30px",
                background: "#fff",
                borderRadius: "10px",
                border: "2px solid #d81b60",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#d81b60",
                  transition: "0.2s",
                }}
              />
            </div>

            <p style={{ fontSize: "22px" }}>{progress}%</p>
          </>
        )}
      </div>
    );
  }

  // ✅ AFTER loading → show full dashboard
  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
      {/* ✅ ADD PATIENT FORM */}
      <div
        style={{
          width: "350px",
          padding: "20px",
          background: "#fff2f8",
          borderRadius: "10px",
        }}
      >
        <h2>➕ Add Patient</h2>

        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />

          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />

          <label>Notes:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />

          <label>Priority:</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 20, padding: 8 }}
          >
            <option value="regular">Regular</option>
            <option value="priority">Priority</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#d81b60",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Add to Queue
          </button>
        </form>
      </div>

      {/* ✅ QUEUE MANAGER */}
      <div style={{ flex: 1 }}>
        <h2>🩷 Queue Manager</h2>

        <button
          onClick={callNext}
          style={{
            padding: "8px 16px",
            background: "#d81b60",
            color: "white",
            border: "none",
            borderRadius: 6,
            marginBottom: 15,
          }}
        >
          📣 Call Next
        </button>

        <table width="100%" border="1">
          <thead>
            <tr>
              <th>#</th>
              <th>Queue</th>
              <th>Name</th>
              <th>Age</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((q, i) => (
              <tr key={q.id}>
                <td>{i + 1}</td>
                <td>{q.queue_number}</td>
                <td>{q.name}</td>
                <td>{q.age}</td>
                <td>{q.priority}</td>
                <td>{q.status}</td>
                <td>
                  <button onClick={() => updateStatus(q.id, "serving")}>
                    Serve
                  </button>
                  <button onClick={() => updateStatus(q.id, "done")}>
                    Done
                  </button>
                  <button onClick={() => updateStatus(q.id, "no_show")}>
                    No Show
                  </button>

                  <button
                    onClick={() => deleteEntry(q.id)}
                    style={{
                      marginLeft: "5px",
                      background: "#b71c1c",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
