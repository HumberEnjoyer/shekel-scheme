import React, { useEffect, useState } from "react";
function Navbar({ user }) {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gray-900">
      <a
        className="text-lg font-bold text-indigo-300 cursor-pointer"
        href="/"
      >
        Shekel Scheme
      </a>
      {user ? (
        <div className="flex items-center gap-4 text-sm text-indigo-100">
          <span>Welcome, {user.username}</span>
          <span>Shekel Tokens: {user.shekelTokens}</span>
        </div>
      ) : (
        <div className="flex gap-3">
          <a
            href="/login"
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:opacity-90 transition"
          >
            Register
          </a>
        </div>
      )}
    </nav>
  );
}

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
      <Navbar user={user} />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-white mb-6">Your Purchased NFTs</h2>
        {purchasedNFTs.length === 0 ? (
          <p className="text-indigo-300">You haven’t purchased any NFTs yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {purchasedNFTs.map((nft) => (
              <div
                key={nft._id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between space-y-4"
              >
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="rounded-md w-full h-48 object-cover"
                />
                <h5 className="text-lg font-semibold text-white">{nft.title}</h5>
                <p className="text-indigo-200">Price: {nft.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
