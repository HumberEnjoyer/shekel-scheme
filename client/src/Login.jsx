import React, { useState } from "react";

// login component to handle user login functionality
function Login({ onLogin }) {
  // state to store the email entered by the user
  const [email, setEmail] = useState("");

  // state to store the password entered by the user
  const [password, setPassword] = useState("");

  // state to store error messages
  const [error, setError] = useState("");

  // function to handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate that email and password are provided
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      // send a request to the server to log in the user
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // handle success or error response from the server
      if (response.ok) {
        onLogin({ email, password });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // render the login form
  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[42.5rem]">
      <div className="w-full max-w-5xl bg-gray-900 p-20 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center text-white mb-12">
          Welcome back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl ml-auto">
          {/* input field for email */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your email"
              required
            />
          </div>

          {/* input field for password */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your password"
              required
            />
          </div>

          {/* display error message if any */}
          {error && <div className="text-base text-red-400">{error}</div>}

          {/* submit button to log in */}
          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Sign in
          </button>
        </form>

        {/* link to navigate to the registration page */}
        <div className="mt-10 text-center text-base text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-indigo-400 cursor-pointer hover:underline"
            onClick={() => onLogin(null)}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;