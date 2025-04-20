import React, { useState } from "react";

function BuyNow({ nft, goBack, isLoggedIn, token }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePurchase = async () => {
    if (!isLoggedIn || !token) {
      setError("You must be logged in to make a purchase.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nftId: nft._id }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Purchase successful!");
        setError("");
      } else {
        setError(data.message || "Failed to purchase NFT.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error purchasing NFT:", err);
      setError("Something went wrong. Try again later.");
      setSuccess("");
    }
  };

  if (!nft) return <div className="text-center mt-10 text-indigo-300">No NFT selected.</div>;

  return (
<div className="min-h-screen flex items-center justify-center bg-[#0f0f1b] px-60 text-white">
<div className="pl-[190px] w-full">
        <div className="w-full max-w-7xl bg-gray-900 p-20 rounded-3xl shadow-2xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img
              src={nft.image}
              alt={nft.title}
              className="w-full h-[30rem] object-cover rounded-2xl border border-gray-700"
            />
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-white text-left">{nft.title}</h2>
              <p className="text-indigo-300 text-2xl text-left">Price: {nft.price}</p>

              {error && <div className="text-red-400 text-lg text-left">{error}</div>}
              {success && <div className="text-green-400 text-lg text-left">{success}</div>}

              <div className="space-y-6">
                <button
                  className="w-full py-6 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 font-semibold hover:opacity-90 transition text-xl"
                  onClick={handlePurchase}
                >
                  Confirm Purchase
                </button>

                <button
                  className="w-full py-6 rounded-lg text-white bg-gray-800 hover:bg-gray-700 font-medium transition text-xl"
                  onClick={goBack}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;