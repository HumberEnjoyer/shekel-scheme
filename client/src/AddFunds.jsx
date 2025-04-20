import React, { useState } from "react";

// add funds component to allow users to add funds to their account
function AddFunds({ token, onSuccess }) {
  // state to store the amount entered by the user
  const [amount, setAmount] = useState("");

  // state to manage the loading state of the form
  const [loading, setLoading] = useState(false);

  // state to store messages for success or error
  const [message, setMessage] = useState("");

  // function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // validate the entered amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setMessage("Please enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      // send a request to the server to add funds
      const response = await fetch("http://localhost:5000/api/funds", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const data = await response.json();

      // handle success or error response from the server
      if (response.ok) {
        setMessage("Funds added successfully!");
        setAmount("");
        if (onSuccess) onSuccess(data.balance);
      } else {
        setMessage(data.message || "Error adding funds");
      }
    } catch (error) {
      // handle any errors that occur during the request
      console.error("Error adding funds:", error);
      setMessage("Error adding funds");
    } finally {
      // reset the loading state
      setLoading(false);
    }
  };

  // render the add funds form
  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[45rem] py-20 text-white">
      <div className="w-full max-w-xl bg-gray-900 p-16 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center mb-12">Add Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            {/* input field for entering the amount */}
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
          {/* display success or error message */}
          {message && <div className="text-base text-indigo-400">{message}</div>}
          {/* submit button */}
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