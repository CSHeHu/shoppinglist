import React, { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || "",
  );
  // TODO: Storing tokens in `localStorage` is a temporary client-side hack.
  // Prefer keeping access tokens in memory and using silent-refresh, or use
  // secure http-only cookies for both access/refresh flows to reduce XSS risk.
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || data.error?.message || "Login failed");
        return;
      }
      localStorage.setItem("accessToken", data.accessToken);
      setAccessToken(data.accessToken);
      setMsg("Logged in");
    } catch (err) {
      setMsg("Network error");
    }
  };

  const fetchItems = async () => {
    setMsg("");
    try {
      const res = await fetch("/api/v1/items", {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) {
        setMsg("Failed to fetch items");
        return;
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setMsg("Network error");
    }
  };

  const logout = async () => {
    await fetch("/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    setAccessToken("");
    setMsg("Logged out");
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Frontend SPA (basic)</h1>
      <div style={{ maxWidth: 400 }}>
        <form onSubmit={login}>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>

        <div style={{ marginTop: 12 }}>
          <button onClick={fetchItems}>Fetch Items</button>
          <button onClick={logout} style={{ marginLeft: 8 }}>
            Logout
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Message:</strong> {msg}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Items:</strong>
          <pre>{JSON.stringify(items, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
