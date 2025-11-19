const API_BASE = "http://localhost:3000/api/auth";
export async function registerApi(payload) {
const res = await fetch(`${API_BASE}/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
return res;
}


export async function loginApi(payload) {
const res = await fetch(`${API_BASE}/login`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});
return res;
}


export async function meApi(token) {
const res = await fetch(`http://localhost:5000/api/user/me`, {
headers: { Authorization: `Bearer ${token}` },
});
return res;
}