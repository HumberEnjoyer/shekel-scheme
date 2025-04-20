import React, { useState } from "react";

function AddFunds({ token, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/account/funds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Funds added successfully!");
        setAmount("");
        if (onSuccess) onSuccess(data.newBalance);
      } else {
        setMessage(data.message || "Error adding funds");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error adding funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[45rem] py-20 text-white">
      <div className="w-full max-w-5xl bg-gray-900 p-16 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center mb-12 text-white">
          Add Funds
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl ml-auto">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Amount (Shekel Tokens)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amount"
            />
          </div>
          {message && <div className="text-base text-indigo-400">{message}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Adding..." : "Add Funds"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFunds;
