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
    return (
      <div className="min-h-screen bg-[#0f0f1b] text-white flex items-center justify-center">
        <p className="text-lg text-indigo-200">Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1b] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-white mb-6">Your Purchased NFTs</h2>
        {purchasedNFTs.length === 0 ? (
          <p className="text-indigo-300">You haven’t purchased any NFTs yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {purchasedNFTs.map((nft) => (
              <div
                key={nft._id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col justify-between space-y-3 h-[16rem]"
              >
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="rounded-md w-full h-32 object-cover"
                />
                <h5 className="text-base font-semibold text-white truncate">{nft.title}</h5>
                <p className="text-sm text-indigo-200">Price: {nft.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
