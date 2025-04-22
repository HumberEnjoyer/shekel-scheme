import React, { useState, useEffect } from "react";
import "./App.css";

import Login     from "./Login";
import Register  from "./Register";
import BuyNow    from "./BuyNow";
import CreateNFT from "./CreateNFT";
import AddFunds  from "./AddFunds";
import Comments  from "./Comments";
import Account   from "./Account";

const API = "http://localhost:5000";

function App() {
  /* ───────── state ───────── */
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username,   setUsername]   = useState("");
  const [token,      setToken]      = useState(null);
  const [shekelBalance, setShekelBalance] = useState(0);

  const [nfts, setNfts] = useState([
    {
      id: 1,
      _id: "68046a559011bb59bc611b97",
      title: "Art",
      image: "/cow.png",
      price: "$50",
    },
    {
      id: 2,
      _id: "68046b4a9011bb59bc611b9f",
      title: "Digital Wonder",
      image: "/duck.png",
      price: "$70",
    },
    {
      id: 3,
      _id: "68046b639011bb59bc611ba0",
      title: "Modern Portrait",
      image: "/fish.png",
      price: "$100",
    },
    {
      id: 4,
      _id: "68046b6c9011bb59bc611ba1",
      title: "Zebra",
      image: "/zebra.png",
      price: "$25",
    },
    {
      id: 5,
      _id: "68046b779011bb59bc611ba2",
      title: "Proboscis",
      image: "/monkey.png",
      price: "$45",
    },
    {
      id: 6,
      _id: "68046b7f9011bb59bc611ba3",
      title: "Shekel",
      image: "/shekel.png",
      price: "$95",
    },
  ]);
  const [loading, setLoading] = useState(true);

  /* ───────── restore auth ───────── */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.token) {
      setIsLoggedIn(true);
      setUsername(stored.username || stored.email);
      setToken(stored.token);
      fetchShekelBalance(stored.token);
    }
  }, []);

  /* ───────── fetch NFTs for sale ───────── */
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API}/upload/nfts`);
        const list = await res.json();
        const formatted = list.map((n) => ({
          id: n._id,
          _id: n._id,
          title: n.title,
          price: `$${n.price}`,
          image: `${API}${n.imageUrl}`,
        }));
        setNfts(formatted);
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ───────── helpers ───────── */
  const fetchShekelBalance = async (tok) => {
    try {
      const res  = await fetch(`${API}/api/balance`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (res.ok) setShekelBalance(data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleNFTCreated = (newNFT) => {
    if (newNFT.isForSale) {
      setNfts((prev) => [
        ...prev,
        {
          id: newNFT._id,
          _id: newNFT._id,
          title: newNFT.title,
          price: `$${newNFT.price}`,
          image: `${API}${newNFT.imageUrl}`,
        },
      ]);
    }
    setCurrentPage("home");
  };

  const handleBuyNow = (nft) => {
    setSelectedNft(nft);
    setCurrentPage("buyNow");
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Invalid credentials");
      setIsLoggedIn(true);
      setUsername(data.username || data.email);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentPage("home");
      fetchShekelBalance(data.token);
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const handleRegister = async (form) => {
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Registration error");
      alert("Registration successful! Please log in.");
      setCurrentPage("login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setToken(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
  };

  /* Remove NFT from the home feed after purchase */
  const handlePurchased = (nftId) => {
    setNfts((prev) => prev.filter((n) => n._id !== nftId));
    setCurrentPage("account");
  };

  /* ───────── UI sections ───────── */
  const renderHome = () => (
    <div className="px-10 py-10 text-center">
      <h1
        className="text-4xl md:text-5xl bg-gradient-to-r from-indigo-500 to-indigo-200 text-transparent bg-clip-text mb-3"
        style={{ fontFamily: '"Pacifico", cursive' }}
      >
        Shekel Scheme
      </h1>
      <p className="text-indigo-200/70 mb-6">NFTs for people with no morals.</p>

      {isLoggedIn && (
        <button
          onClick={() => setCurrentPage("create")}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold transition duration-300 bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-[length:100%_150%] mb-6"
        >
          Create New NFT
        </button>
      )}

      {loading ? (
        <div className="text-indigo-300">Loading NFTs...</div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {nfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-gray-800 p-10 rounded-2xl shadow-2xl flex flex-col justify-between"
              >
                <img
                  src={nft.image}
                  alt={nft.title}
                  className="rounded-md mb-8 w-full h-[22rem] object-cover"
                />
                <h3 className="text-3xl font-semibold text-white mb-1">
                  {nft.title}
                </h3>
                <p className="text-indigo-200 text-xl mb-3">
                  Price: {nft.price}
                </p>
                <button
                  onClick={() => handleBuyNow(nft)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-[length:100%_150%] w-full"
                >
                  Buy Now
                </button>
                <Comments
                  nftId={nft._id}
                  token={token}
                  isLoggedIn={isLoggedIn}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case "buyNow":
        return (
          <BuyNow
            nft={selectedNft}
            goBack={() => setCurrentPage("home")}
            isLoggedIn={isLoggedIn}
            token={token}
            balance={shekelBalance}
            onSuccess={(bal) => setShekelBalance(bal)}
            onPurchased={handlePurchased}
          />
        );
      case "login":
        return <Login onLogin={handleLogin} />;
      case "register":
        return <Register onRegister={handleRegister} />;
      case "create":
        return <CreateNFT onNFTCreated={handleNFTCreated} />;
      case "addFunds":
        return (
          <AddFunds
            token={token}
            onSuccess={(bal) => {
              setShekelBalance(bal);
              setCurrentPage("home");
            }}
          />
        );
      case "account":
        return (
          <Account
            user={{ username, shekelTokens: shekelBalance, token }}
            onRelist={(nft) => setNfts((prev) => [...prev, nft])}
          />
        );
      default:
        return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] text-white">
      <Navbar
        navigateTo={setCurrentPage}
        isLoggedIn={isLoggedIn}
        username={username}
        balance={shekelBalance}
        onLogout={handleLogout}
      />
      {renderPage()}
    </div>
  );
}

/* ───────── Navbar ───────── */
function Navbar({ navigateTo, isLoggedIn, username, balance, onLogout }) {
  return (
    <nav className="z-30 w-full pt-2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-21 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 mt-5">
          <span
            className="flex flex-1 items-center justify-start gap-3 text-lg font-bold text-indigo-300 cursor-pointer"
            onClick={() => navigateTo("home")}
          >
            Shekel Scheme
          </span>

          {isLoggedIn ? (
            <div className="flex flex-1 items-center justify-end gap-3">
              <span className="text-indigo-100 text-sm">
                Welcome, {username} | {balance} Shekel Coins
              </span>
              <button
                className="btn-sm bg-gray-800 py-[5px] text-gray-300"
                onClick={() => navigateTo("account")}
              >
                Account
              </button>
              <button
                className="btn-sm bg-gray-800 py-[5px] text-gray-300"
                onClick={() => navigateTo("addFunds")}
              >
                Add Funds
              </button>
              <button
                className="btn-sm bg-gray-800 py-[5px] text-gray-300"
                onClick={() => navigateTo("create")}
              >
                Create NFT
              </button>
              <button
                className="btn-sm bg-gray-800 py-[5px] text-gray-300"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="btn-sm bg-gray-800 py-[5px] text-gray-300"
                onClick={() => navigateTo("login")}
              >
                Login
              </button>
              <button
                className="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 py-[5px] text-white"
                onClick={() => navigateTo("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default App;
