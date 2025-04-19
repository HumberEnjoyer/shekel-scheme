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
        body: JSON.stringify({
          nftId: nft._id, // Use `_id` instead of `id`
        }),
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

  if (!nft) return <div className="text-center mt-5">No NFT selected.</div>;

  return (
    <div className="container mt-5 text-center">
      <div className="card mx-auto shadow" style={{ maxWidth: "500px" }}>
        <img src={nft.image} className="card-img-top" alt={nft.title} />
        <div className="card-body">
          <h5 className="card-title">{nft.title}</h5>
          <p className="card-text">Price: {nft.price}</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button className="btn btn-success w-100 mb-2" onClick={handlePurchase}>
            Confirm Purchase
          </button>
          <button className="btn btn-secondary w-100" onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;