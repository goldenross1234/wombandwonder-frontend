import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function QueueReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const res = await axios.get(`${API}/queue/reports/`);
    setReports(res.data);
  };

  const filtered = reports.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.queue_number.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["Queue Number", "Name", "Age", "Priority", "Notes", "Served At"],
      ...reports.map(r => [
        r.queue_number,
        r.name,
        r.age || "",
        r.priority,
        r.notes,
        r.served_at,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map(e => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "queue_report.csv";
    link.click();
  };

  return (
    <div style={{ padding: "25px" }}>
      <h1 style={{ color: "#d81b60" }}>📊 Queue Served Reports</h1>

      {/* ✅ Search */}
      <input
        type="text"
        placeholder="Search name or queue number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />

      {/* ✅ Export */}
      <button
        onClick={exportCSV}
        style={{
          marginLeft: "20px",
          padding: "10px 20px",
          background: "#d81b60",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Export CSV
      </button>

      {/* ✅ Table */}
      <table
        width="100%"
        border="1"
        style={{ marginTop: "20px", background: "white" }}
      >
        <thead style={{ background: "#ffd6e8" }}>
          <tr>
            <th>#</th>
            <th>Queue Number</th>
            <th>Name</th>
            <th>Age</th>
            <th>Priority</th>
            <th>Notes</th>
            <th>Served At</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r, i) => (
            <tr key={r.id}>
              <td>{i + 1}</td>
              <td>{r.queue_number}</td>
              <td>{r.name}</td>
              <td>{r.age}</td>
              <td>{r.priority}</td>
              <td>{r.notes}</td>
              <td>{new Date(r.served_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
