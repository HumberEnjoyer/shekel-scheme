import React, { useState } from "react";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setSuccess("Account created successfully!");
        setError("");
        setEmail("");
        setPassword("");
        setConfirm("");
        if (onRegister) onRegister();
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("Error connecting to server.");
      setSuccess("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", width: "100vw" }}>
      <div className="card shadow p-5" style={{ width: "100%", maxWidth: "600px", borderRadius: "12px" }}>
        <h2 className="text-center mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirm" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button type="submit" className="btn btn-primary w-100 fs-5">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
