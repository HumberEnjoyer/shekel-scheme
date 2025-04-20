import React, { useState, useEffect } from "react";

// buy now component to handle nft purchase functionality
function BuyNow({ nft, goBack, isLoggedIn, token, balance, onSuccess }) {
  // state to store error messages
  const [error, setError] = useState("");

  // state to store success messages
  const [success, setSuccess] = useState("");

  // state to determine if the user can afford the nft
  const [isAffordable, setIsAffordable] = useState(false);

  // useEffect to check if the user has enough balance to purchase the nft
  useEffect(() => {
    if (nft?.price && balance !== undefined) {
      const numericPrice = Number(nft.price.replace("$", ""));
      setIsAffordable(balance >= numericPrice);
    }
  }, [balance, nft]);

  // function to handle the purchase of the nft
  const handlePurchase = async () => {
    setError("");
    setSuccess("");

    // check if the user is logged in and has a valid token
    if (!isLoggedIn || !token) {
      setError("You must be logged in.");
      return;
    }

    // check if the user has sufficient balance
    if (!isAffordable) {
      setError("Insufficient balance.");
      return;
    }

    try {
      // send a request to the server to purchase the nft
      const res = await fetch("http://localhost:5000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nftId: nft._id }),
      });

      const data = await res.json();

      // handle success or error response from the server
      if (res.ok) {
        setSuccess("Purchase successful!");
        if (data.balance !== undefined && onSuccess) {
          onSuccess(data.balance);
        }
      } else {
        setError(data.message || "Purchase failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  // render a message if no nft is selected
  if (!nft) return <div className="text-center mt-10 text-indigo-300">No NFT selected.</div>;

  // render the buy now page
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1b] px-60 text-white">
      <div className="pl-[190px] w-full">
        <div className="w-full max-w-7xl bg-gray-900 p-20 rounded-3xl shadow-2xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* display nft image */}
            <img
              src={nft.image}
              alt={nft.title}
              className="w-full h-[30rem] object-cover rounded-2xl border border-gray-700"
            />
            <div className="space-y-8">
              {/* display nft title */}
              <h2 className="text-5xl font-bold text-white text-left">{nft.title}</h2>
              {/* display nft price */}
              <p className="text-indigo-300 text-2xl text-left">Price: {nft.price}</p>

              {/* display error message if any */}
              {error && <div className="text-red-400 text-lg">{error}</div>}
              {/* display success message if any */}
              {success && <div className="text-green-400 text-lg">{success}</div>}

              {/* button to confirm purchase */}
              <button
                className={`w-full py-6 rounded-lg text-xl text-white font-semibold transition ${
                  isAffordable
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-90"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
                disabled={!isAffordable}
                onClick={handlePurchase}
              >
                {isAffordable ? "Confirm Purchase" : "Insufficient Balance"}
              </button>

              {/* button to go back to the previous page */}
              <button
                className="w-full py-6 rounded-lg text-xl text-white bg-gray-800 hover:bg-gray-700"
                onClick={goBack}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;