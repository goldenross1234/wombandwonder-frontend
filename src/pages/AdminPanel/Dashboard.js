import React from "react";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-pink-100">
      <h2 className="text-xl font-semibold text-pink-700 mb-3">
        Welcome back, {role || "User"}!
      </h2>
      <p className="text-gray-600">
        Use the navigation links above to manage your Womb & Wonder content.
      </p>
    </div>
  );
}
