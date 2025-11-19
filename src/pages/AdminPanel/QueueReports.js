// QueueReports.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "../../api/axiosConfig";          // ✔ global axios
import { loadConfig } from "../../config/runtimeConfig"; // ✔ dynamic backend

export default function QueueReports() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");

  const [dateFilter, setDateFilter] = useState("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ----------------------------------------
  // Load Reports (wrapped in useCallback)
  // ----------------------------------------
  const loadReports = useCallback(async () => {
    try {
      let url = `queue/reports/?sort=-served_at`;

      if (!fromDate && !toDate) {
        url += `&date=${dateFilter}`;
      }

      if (fromDate) url += `&from=${fromDate}`;
      if (toDate) url += `&to=${toDate}`;

      const res = await axios.get(url);
      setReports(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load reports");
    }
  }, [dateFilter, fromDate, toDate]);

  // ----------------------------------------
  // INIT + reload when filter changes
  // ----------------------------------------
  useEffect(() => {
    async function init() {
      await loadConfig();   // ensures dynamic config is loaded
      loadReports();
    }
    init();
  }, [loadReports]); // ESLint-safe

  const applyRange = () => {
    if (!fromDate || !toDate) {
      alert("Select both FROM and TO dates");
      return;
    }
    loadReports();
  };

  // ----------------------------------------
  // CSV Export
  // ----------------------------------------
  const exportCSV = () => {
    const rows = [
      ["Queue Number", "Name", "Age", "Priority", "Service", "Notes", "Served At"],
      ...reports.map((r) => [
        r.queue_number,
        r.name,
        r.age || "",
        r.priority,
        r.selected_service || "",
        r.notes || "",
        new Date(r.served_at).toLocaleString(),
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "queue_reports.csv";
    link.click();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ color: "#d81b60", marginBottom: "20px" }}>
        📊 Queue Served Reports
      </h1>

      {/* ---------------------- FILTER SECTION ---------------------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* PRESET BUTTONS */}
        <button onClick={() => setDateFilter("today")} className="filter-btn">
          Today
        </button>
        <button onClick={() => setDateFilter("yesterday")} className="filter-btn">
          Yesterday
        </button>
        <button onClick={() => setDateFilter("this_week")} className="filter-btn">
          This Week
        </button>
        <button onClick={() => setDateFilter("this_month")} className="filter-btn">
          This Month
        </button>

        {/* RANGE */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button onClick={applyRange} className="filter-btn">
            Apply Range
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search name, queue number or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", flex: "1" }}
        />

        {/* CSV */}
        <button
          onClick={exportCSV}
          style={{
            background: "#d81b60",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* ---------------------- REPORTS TABLE ---------------------- */}
      <table width="100%" border="1">
        <thead>
          <tr style={{ background: "#ffcee0" }}>
            <th>#</th>
            <th>Queue Number</th>
            <th>Name</th>
            <th>Age</th>
            <th>Priority</th>
            <th>Service</th>
            <th>Notes</th>
            <th>Served At</th>
          </tr>
        </thead>

        <tbody>
          {reports
            .filter(
              (r) =>
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.queue_number.toLowerCase().includes(search.toLowerCase()) ||
                (r.selected_service || "")
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.queue_number}</td>
                <td>{r.name}</td>
                <td>{r.age || ""}</td>
                <td>{r.priority}</td>
                <td>{r.selected_service || "—"}</td>
                <td>{r.notes || ""}</td>
                <td>{new Date(r.served_at).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <style>
        {`
        .filter-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid #d81b60;
          color: #d81b60;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.2s;
        }
        .filter-btn:hover {
          background: #d81b60;
          color: white;
        }
      `}
      </style>
    </div>
  );
}
