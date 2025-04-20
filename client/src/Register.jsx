import React, { useState } from "react";

function Register({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, walletAddress, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registered successfully. You can now log in.");
        setUsername("");
        setEmail("");
        setWalletAddress("");
        setPassword("");
        setConfirm("");
        if (onRegister) onRegister();
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage("Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[42.5rem] py-20">
      <div className="w-full max-w-5xl bg-gray-900 p-16 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center text-white mb-12">
          Create an account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl ml-auto">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your wallet address"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your password"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          {message && <div className="text-base text-indigo-400">{message}</div>}
          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>
        <div className="mt-10 text-center text-base text-gray-400">
          Already have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => onRegister(null)}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;