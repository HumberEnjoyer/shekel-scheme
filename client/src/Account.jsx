import React, { useEffect, useState } from "react";

function Account({ user, onRelist }) {
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);

  /* Fetch items owned by this user */
  const fetchPurchasedNFTs = async () => {
    try {
      const res  = await fetch("http://localhost:5000/api/account", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setPurchasedNFTs(data.purchasedNFTs);
    } catch (err) {
      console.error("Error fetching purchased NFTs:", err);
    }
  };

  /* Delete NFT from account (local only) */
  const handleDelete = async (nftId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/remove-nft/${nftId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        return alert(data.message || "Failed to delete NFT.");
      }
      setPurchasedNFTs((prev) => prev.filter((n) => n._id !== nftId));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting NFT.");
    }
  };

  /* Relist NFT on the marketplace */
  const handleRelist = async (nftId) => {
    const price = prompt("Set a resale price (Shekel Coins)", "50");
    if (price === null) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/relist-nft/${nftId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ price }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to relist NFT.");
        return;
      }

      /* Remove from account view and add back to home feed */
      setPurchasedNFTs((prev) => prev.filter((n) => n._id !== nftId));
      onRelist?.({
        _id: data.nft._id,
        id: data.nft._id,
        title: data.nft.title,
        price: `$${data.nft.price}`,
        image: `http://localhost:5000${data.nft.imageUrl}`,
      });
      alert("NFT relisted on marketplace!");
    } catch (err) {
      console.error("Relist error:", err);
      alert("Error relisting NFT.");
    }
  };

  useEffect(() => {
    if (user) fetchPurchasedNFTs();
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-center text-white">
        <p className="text-lg text-indigo-200">
          Please log in to view your account.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen px-6 md:px-20 py-16 bg-[#0f0f1b] text-white">
      <h1 className="text-5xl bg-gradient-to-r from-indigo-500 to-indigo-200 text-transparent bg-clip-text mb-4 text-center">
        Your Purchased NFTs
      </h1>
      <p className="text-indigo-200/70 mb-10 text-center text-lg">
        These are NFTs you now own.
      </p>

      {purchasedNFTs.length === 0 ? (
        <div className="text-indigo-300 text-center">
          You haven’t purchased any NFTs yet.
        </div>
      ) : (
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto">
          {purchasedNFTs.map((nft) => (
            <div
              key={nft._id}
              className="bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col"
            >
              <img
                src={`http://localhost:5000${nft.imageUrl}`}
                alt={nft.title}
                className="rounded-md mb-8 w-full h-[22rem] object-cover"
              />
              <h3 className="text-3xl font-semibold text-white mb-1">
                {nft.title}
              </h3>
              <p className="text-indigo-200 text-xl mb-3">
                Last Price: {nft.price}
              </p>

              <button
                onClick={() => handleRelist(nft._id)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 bg-gradient-to-r from-green-600 to-green-500 text-white hover:bg-[length:100%_150%] w-full"
              >
                Relist NFT
              </button>
              <button
                onClick={() => handleDelete(nft._id)}
                className="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 bg-gradient-to-t from-red-600 to-red-500 text-white hover:bg-[length:100%_150%] w-full"
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
