import { useEffect, useState } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:3000/api/auth/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  const riskBadge = (score) => {
    if (score > 60)
      return <span className="badge badge-red">High</span>;
    if (score > 20)
      return <span className="badge badge-yellow">Suspicious</span>;
    return <span className="badge badge-green">Safe</span>;
  };

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">SecureLogin</h2>
        <ul>
          <li className="active">Dashboard</li>
       
          <li
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="content">

        <header className="topbar">
          <h1>Dashboard</h1>
        </header>

        {/* Summary Section */}
        <div className="summary-container">
          <div className="summary-card">
            <h3>Total Logins</h3>
            <p>{logs.length}</p>
          </div>

          <div className="summary-card">
            <h3>Suspicious</h3>
            <p>{logs.filter((x) => x.riskScore > 20).length}</p>
          </div>

          <div className="summary-card">
            <h3>High Risk</h3>
            <p>{logs.filter((x) => x.riskScore > 60).length}</p>
          </div>

          <div className="summary-card">
            <h3>Last Login</h3>
            <p>
              {logs[0]
                ? new Date(logs[0].loginTime).toLocaleString()
                : "None"}
            </p>
          </div>
        </div>

        {/* Login History Table */}
        <h2 className="section-title">Login History</h2>

        <div className="table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>IP</th>
                <th>Country</th>
                <th>Device</th>
                <th>Status</th>
                <th>Risk</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log, i) => (
                <tr
                  key={i}
                  className={log.riskScore > 20 ? "risk-row" : ""}
                >
                  <td>{new Date(log.loginTime).toLocaleString()}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.country || "Unknown"}</td>
                  <td className="device-text">{log.device}</td>
                  <td>{log.status}</td>
                  <td>{riskBadge(log.riskScore)}</td>
                  <td>{log.reason || "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
