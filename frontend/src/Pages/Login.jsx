import React, { useState } from "react";
import "../Pages/auth.css";

import { loginApi } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!email || !password) {
      setMsg("Please enter email and password");
      return;
    }

    try {
      const res = await loginApi({ email, password });
      const data = await res.json();
      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
          return;
        }
        // backend might return suspicious info
        setMsg(data.message || "Login result received");
      } else {
        setMsg(data.error || data.message || "Login failed");
      }
    } catch (err) {
      setMsg("Server error. Try again later.");
      console.error("Login error", err);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>Login</h2>
        {msg && <div className="alert">{msg}</div>}
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
