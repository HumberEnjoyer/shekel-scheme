import React, { useEffect, useState } from "react";

function Account({ user }) {
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

  useEffect(() => {
    const fetchPurchasedNFTs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/account", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setPurchasedNFTs(data.purchasedNFTs);
      } catch (error) {
        console.error("Error fetching purchased NFTs:", error);
      }
    };

    if (user) {
      fetchPurchasedNFTs();
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view your account.</p>;
  }

  return (
    <div className="container my-5">
      <h2>Your Purchased NFTs</h2>
      <div className="row">
        {purchasedNFTs.map((nft) => (
          <div className="col-md-4" key={nft._id}>
            <div className="card">
              <img src={nft.image} className="card-img-top" alt={nft.title} />
              <div className="card-body">
                <h5 className="card-title">{nft.title}</h5>
                <p className="card-text">Price: {nft.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Account;