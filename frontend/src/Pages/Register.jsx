import React, { useState } from "react";
import "../Pages/auth.css";
import { registerApi } from "../api/auth";
export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!name || !username || !email || !password) {
      setMsg("Please fill all fields");
      return;
    }
    try {
      const res = await registerApi({ name, username, email, password });
      const data = await res.json();
      if (res.ok) {
        setMsg(data.message || "Registration successful");
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        setMsg(data.error || data.message || "Registration failed");
      }
    } catch (err) {
      setMsg("Server error. Try again later.");
      console.error("Register error", err);
    }
  };
  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>Create account</h2>
        {msg && <div className="alert">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
