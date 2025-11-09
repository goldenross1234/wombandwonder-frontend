import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

export default function PatientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Handle email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/login/`, {
        username: email,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/patient-dashboard");
    } catch (err) {
      setError("❌ Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_URL}/auth/google/login/`, {
        token: credentialResponse.credential,
      });

      if (res.data.success) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        localStorage.setItem("username", res.data.username);
        navigate("/patient-dashboard");
      } else {
        setError("Google login failed. Try again.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed.");
    }
  };


  return (
    <GoogleOAuthProvider clientId="570583645706-8sgtjpo7ub987eeu3r67chjckg9qgf6d.apps.googleusercontent.com">
      <div className="flex items-center justify-center min-h-screen bg-pink-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-96"
        >
          <h1 className="text-2xl font-bold text-pink-700 mb-6 text-center">
            🌸 Patient Login
          </h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 mb-4 rounded-lg text-center">
              {error}
            </div>
          )}

          <label className="block mb-2 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2 w-full mb-4 focus:outline-pink-400"
            required
          />

          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 w-full mb-6 focus:outline-pink-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-pink-300" : "bg-pink-600 hover:bg-pink-700"
            } text-white w-full py-2 rounded-full transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="mt-6 text-center text-gray-500">or</div>

          <div className="flex justify-center mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("❌ Google Login Failed")}
              width="300"
              shape="pill"
              theme="outline"
              text="signin_with"
            />
          </div>

          <p className="text-center text-gray-400 text-sm mt-4">
            Use your Google account or email to log in.
          </p>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
}
