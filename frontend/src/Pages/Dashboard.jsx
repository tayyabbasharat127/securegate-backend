import React, { useEffect, useState } from "react";
import "../Pages/dashboard.css";
import { meApi } from "../api/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const res = await meApi(token);
        const data = await res.json();
        if (res.ok) setUser(data);
        else {
          setMsg("Session expired");
          localStorage.removeItem("token");
          setTimeout(() => (window.location.href = "/login"), 1300);
        }

        // fetch login events (optional endpoint)
        try {
          const ev = await fetch(
            "http://localhost:4000/api/login-events/user/" +
              (data?.id || data?.userId),
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (ev.ok) {
            const evdata = await ev.json();
            setEvents(evdata.events || evdata);
          }
        } catch (e) {
          /* ignore if endpoint not present */
        }
      } catch (err) {
        setMsg("Server error");
        console.error(err);
      }
    };
    load();
  }, []);

  if (msg)
    return (
      <div className="dash-wrap">
        <p>{msg}</p>
      </div>
    );
  if (!user)
    return (
      <div className="dash-wrap">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="dash-wrap">
      <div className="dash-box">
        <h1>Welcome, {user.name || user.username}</h1>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}
        </p>

        <h3>Recent Login Events</h3>
        {events.length === 0 && <p>No events found.</p>}
        {events.length > 0 && (
          <table className="events-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>IP</th>
                <th>Country</th>
                <th>Device</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{new Date(ev.loginTime).toLocaleString()}</td>
                  <td>{ev.ipAddress}</td>
                  <td>{ev.location}</td>
                  <td>{ev.device}</td>
                  <td>{ev.riskScore?.score ?? "-"}</td>
                  <td>{ev.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="dash-actions">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
