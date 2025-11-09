import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueManager() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("regular");

  const loadQueue = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/queue/`);
    setQueue(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  // ✅ ADD PATIENT (Fixes wrong endpoint)
  const handleAddPatient = async () => {
    if (!name) return alert("Name is required");

    try {
      await axios.post(`${API}/join-queue/`, {
        name,
        age,
        notes,
        priority
      });

      setName("");
      setAge("");
      setNotes("");
      setPriority("regular");

      loadQueue();
    } catch (err) {
      console.error(err);
      alert("Error adding patient!");
    }
  };

  // ✅ Update patient status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/queue/${id}/`, { status });
      loadQueue();
    } catch (error) {
      console.error(error);
      alert("Error updating status!");
    }
  };

  // ✅ Delete queue entry
  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this queue entry?")) return;

    try {
      await axios.delete(`${API}/queue/${id}/`);
      loadQueue();
    } catch (err) {
      console.error(err);
      alert("Error deleting entry!");
    }
  };

  // ✅ Call next patient
  const callNext = async () => {
    const waiting = queue.filter((q) => q.status === "waiting");

    if (waiting.length === 0) {
      alert("No waiting patients!");
      return;
    }

    const next =
      waiting.find((q) => q.priority === "priority") || waiting[0];

    updateStatus(next.id, "serving");
  };

  return (
    <div style={{ padding: "30px", display: "flex", gap: "40px" }}>
      
      {/* LEFT — Add Patient */}
      <div
        style={{
          width: "35%",
          background: "#ffe6f0",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ color: "#a30c5b", marginBottom: "15px" }}>
          ➕ Add Patient
        </h2>

        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Age:</label>
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", height: "80px" }}
        />

        <label>Priority:</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: "100%", marginBottom: "15px" }}
        >
          <option value="regular">Regular</option>
          <option value="priority">Priority</option>
        </select>

        <button
          onClick={handleAddPatient}
          style={{
            width: "100%",
            padding: "12px",
            background: "#c2185b",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px"
          }}
        >
          Add to Queue
        </button>
      </div>

      {/* RIGHT — Queue List */}
      <div style={{ width: "65%" }}>
        <h2 style={{ color: "#a30c5b" }}>💗 Queue Manager</h2>

        <button
          onClick={callNext}
          style={{
            background: "#ff4081",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            marginBottom: "15px",
            cursor: "pointer"
          }}
        >
          📣 Call Next
        </button>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white"
          }}
        >
          <thead style={{ background: "#ffd6e8" }}>
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
              <tr key={q.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{i + 1}</td>
                <td><b>{q.queue_number}</b></td>
                <td>{q.name}</td>
                <td>{q.age}</td>
                <td>{q.priority}</td>
                <td>{q.status}</td>
                <td>
                  <button
                    className="btn-small"
                    onClick={() => updateStatus(q.id, "serving")}
                  >
                    Serve
                  </button>

                  <button
                    className="btn-small"
                    onClick={() => updateStatus(q.id, "done")}
                  >
                    Done
                  </button>

                  <button
                    className="btn-small"
                    onClick={() => updateStatus(q.id, "no_show")}
                  >
                    No Show
                  </button>

                  <button
                    onClick={() => deleteEntry(q.id)}
                    style={{
                      marginLeft: "5px",
                      background: "#b71c1c",
                      color: "white",
                      padding: "3px 6px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
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
