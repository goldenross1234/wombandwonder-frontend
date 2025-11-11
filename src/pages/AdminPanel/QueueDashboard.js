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

  // ✅ Reset on refresh (fix Start Day clickable again)
  useEffect(() => {
    setStarted(false);
    setProgress(0);
  }, []);
  
  // ✅ Load queue
  const fetchQueue = async () => {
    const res = await axios.get(`${API}/queue/`);
    setQueue(res.data);
  };

  useEffect(() => {
    if (!started) return;
    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);
    return () => clearInterval(interval);
  }, [started]);

  // ✅ Handle form changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Add patient
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/queue/`, form);
    setForm({ name: "", age: "", notes: "", priority: "regular" });
    fetchQueue();
  };

  // ✅ Delete patient
  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this queue entry?")) return;
    await axios.delete(`${API}/queue/${id}/`);
    fetchQueue();
  };

  // ✅ Serve patient → Move to Repository + Remove from Queue
  const servePatient = async (id) => {
    await axios.post(`${API}/queue/serve/${id}/`);
    fetchQueue();
  };

  // ✅ Update status (Done, No Show)
  const updateStatus = async (id, status) => {
    await axios.patch(`${API}/queue/${id}/`, { status });
    fetchQueue();
  };

  // ✅ Delete ALL queue entries
  const clearQueue = async () => {
    if (!window.confirm("Delete ALL queue entries? This cannot be undone."))
      return;

    await axios.delete(`${API}/queue/clear/`);
    fetchQueue();
  };

  // ✅ Start the day loading animation
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

  // ✅ BEFORE start
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

  // ✅ AFTER loading → main UI
  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
      {/* ✅ ADD PATIENT FORM */}
      <div
        style={{
          width: "350px",
          padding: "20px",
          background: "#fff2f8",
          borderRadius: "10px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
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
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Notes:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 10 }}
          />

          <label>Priority:</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: 20 }}
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

      {/* ✅ QUEUE TABLE */}
      <div style={{ flex: 1 }}>
        <h2>🩷 Queue Manager</h2>

        {/* ✅ DELETE ALL button */}
        <button
          onClick={clearQueue}
          style={{
            padding: "8px 16px",
            background: "#b71c1c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            marginBottom: "15px",
            cursor: "pointer",
          }}
        >
          🗑️ Delete All Entries
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
              <tr
                key={q.id}
                style={{
                  background:
                    q.priority === "priority" ? "#ffe8e8" : "white",
                  animation:
                    q.priority === "priority" ? "blink 1s infinite" : "none",
                }}
              >
                <td>{i + 1}</td>
                <td>{q.queue_number}</td>
                <td>{q.name}</td>
                <td>{q.age}</td>
                <td>{q.priority}</td>
                <td>{q.status}</td>

                <td>
                  <button onClick={() => servePatient(q.id)} style={{ marginRight: 5 }}>
                    Serve Regular
                  </button>

                  <button onClick={() => servePatient(q.id)} style={{ marginRight: 5 }}>
                    Serve Priority
                  </button>

                  <button onClick={() => updateStatus(q.id, "done")}>Done</button>

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
                      padding: "4px 8px",
                      borderRadius: "4px",
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
