import React, { useState } from "react";

function BuyNow({ nft, goBack, user }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBuyNow = async () => {
    if (!user || !user.token) {
      setError("You must be logged in to make a purchase.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ nftId: nft._id || nft.id }), // Ensure _id is available
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Purchase successful!");
        setError("");
      } else {
        setError(data.message || "Failed to complete the purchase.");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error during purchase:", err);
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="container my-5">
      <button className="btn btn-secondary mb-3" onClick={goBack}>
        Back
      </button>
      <div className="card">
        <img src={nft.image} className="card-img-top" alt={nft.title} />
        <div className="card-body">
          <h5 className="card-title">{nft.title}</h5>
          <p className="card-text">Price: {nft.price}</p>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <button className="btn btn-primary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;
