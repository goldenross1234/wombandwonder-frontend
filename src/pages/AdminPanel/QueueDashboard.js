import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";            // ✔ unified axios with baseURL
import { loadConfig } from "../../config/runtimeConfig"; // ✔ dynamic backend

export default function QueueDashboard() {
  const [queue, setQueue] = useState([]);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    age: "",
    notes: "",
    priority: "regular",
    selected_service: "",
  });

  // ============================================================
  // LOAD CONFIG + SERVICES
  // ============================================================
  useEffect(() => {
    async function init() {
      try {
        await loadConfig();  // still needed for axios to work
        loadServices();
      } catch (err) {
        console.error("Config or services load error:", err);
      }
    }
    init();
  }, []);


  // Load services from backend
  const loadServices = async () => {
    try {
      const res = await axios.get("services/");
      setServices(res.data);
    } catch (err) {
      console.error("loadServices error:", err);
    }
  };

  // Reset startup loader
  useEffect(() => {
    setStarted(false);
    setProgress(0);
  }, []);

  // ============================================================
  // QUEUE FETCHER
  // ============================================================
  const fetchQueue = async () => {
    try {
      const res = await axios.get("queue/");
      setQueue(res.data);
    } catch (err) {
      console.error("fetchQueue error:", err);
    }
  };

  useEffect(() => {
    if (!started) return;
    fetchQueue();
    const timer = setInterval(fetchQueue, 3000);
    return () => clearInterval(timer);
  }, [started]);

  // ============================================================
  // FORM HANDLER
  // ============================================================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Add patient to queue
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("queue/", form);
      setForm({
        name: "",
        age: "",
        notes: "",
        priority: "regular",
        selected_service: "",
      });
      fetchQueue();
    } catch (err) {
      console.error("add patient error:", err);
      alert("Error adding patient!");
    }
  };

  // Delete single queue item
  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this queue entry?")) return;
    try {
      await axios.delete(`queue/${id}/`);
      fetchQueue();
    } catch (err) {
      console.error("deleteEntry error:", err);
    }
  };

  // Serve patient
  const servePatient = async (id) => {
    try {
      await axios.patch(`queue/${id}/`, { status: "serving" });
      fetchQueue();
    } catch (err) {
      console.error("servePatient error:", err);
      alert("Error marking as serving");
    }
  };

  // Mark patient as done (moves to repository)
  const markDone = async (id) => {
    try {
      await axios.post(`queue/serve/${id}/`);
      fetchQueue();
    } catch (err) {
      console.error("markDone error:", err);
      alert("Error marking done");
    }
  };

  // Update status: no_show, waiting, etc.
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`queue/${id}/`, { status });
      fetchQueue();
    } catch (err) {
      console.error("updateStatus error:", err);
      alert("Error updating status");
    }
  };

  // Clear entire queue
  const clearQueue = async () => {
    if (!window.confirm("Delete ALL queue entries?")) return;
    try {
      await axios.delete("queue/clear/");
      fetchQueue();
    } catch (err) {
      console.error("clearQueue error:", err);
    }
  };

  // ============================================================
  // LOADING SCREEN BEFORE SYSTEM START
  // ============================================================
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

  // BEFORE clicking "Start Day"
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

  // ============================================================
  // MAIN DASHBOARD AFTER START
  // ============================================================
  return (
    <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
      {/* FORM */}
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

        <label>Service (optional):</label>
        <select
          name="selected_service"
          value={form.selected_service}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 20 }}
        >
          <option value="">-- Select Service --</option>

          {[...new Set(services.map((s) => s.category?.name))].map((cat) => (
            <optgroup key={cat} label={cat || "Other"}>
              {services
                .filter((s) => s.category?.name === cat)
                .map((svc) => (
                  <option key={svc.id} value={svc.name}>
                    {svc.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>

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

      {/* QUEUE TABLE */}
      <div style={{ flex: 1 }}>
        <h2>🩷 Queue Manager</h2>

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
                <td>{q.age || "—"}</td>
                <td style={{ textTransform: "capitalize" }}>
                  {q.priority}
                </td>
                <td>{q.status}</td>

                <td>
                  <button onClick={() => servePatient(q.id)}>
                    Serve Regular
                  </button>

                  <button onClick={() => servePatient(q.id)}>
                    Serve Priority
                  </button>

                  <button onClick={() => markDone(q.id)}>
                    Done
                  </button>

                  <button
                    onClick={() => updateStatus(q.id, "no_show")}
                  >
                    No Show
                  </button>

                  <button
                    onClick={() => deleteEntry(q.id)}
                    style={{
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

            {queue.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  No queue entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
