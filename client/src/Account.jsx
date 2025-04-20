import React, { useEffect, useState } from "react";

function Account({ user }) {
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

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

  const handleDelete = async (nftId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/remove-nft/${nftId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setPurchasedNFTs(purchasedNFTs.filter((nft) => nft._id !== nftId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete NFT.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting NFT.");
    }
  };

  useEffect(() => {
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
    <div className="min-h-screen px-20 py-16 bg-[#0f0f1b] text-white">
      <h1 className="text-5xl font-nacelle bg-gradient-to-r from-indigo-500 to-indigo-200 text-transparent bg-clip-text mb-4 text-center">
        Your Purchased NFTs
      </h1>
      <p className="text-indigo-200/70 mb-10 text-center text-lg">These are NFTs you now own.</p>
      {purchasedNFTs.length === 0 ? (
        <div className="text-indigo-300 text-center">You haven’t purchased any NFTs yet.</div>
      ) : (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto">
          {purchasedNFTs.map((nft) => (
            <div
              key={nft._id}
              className="bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col justify-between"
            >
              <img
                src={`http://localhost:5000${nft.imageUrl}`}
                alt={nft.title}
                className="rounded-md mb-8 w-full h-[22rem] object-cover"
              />
              <h3 className="text-3xl font-semibold text-white mb-1">{nft.title}</h3>
              <p className="text-indigo-200 text-xl mb-3">Price: {nft.price}</p>
              <button
                onClick={() => handleDelete(nft._id)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-[length:100%_150%] w-full"
              >
                Delete NFT
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Account;
