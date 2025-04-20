import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import BuyNow from "./BuyNow";
import CreateNFT from "./CreateNFT";
import AddFunds from "./AddFunds";
import Comments from "./Comments";
import Account from "./Account";

const API = "http://localhost:5000";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      setIsLoggedIn(true);
      setUsername(storedUser.username || storedUser.email);
      setToken(storedUser.token);
      fetchShekelBalance(storedUser.token);
    }
  }, []);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const res = await fetch(`${API}/upload/nfts`);
        const serverNFTs = await res.json();
        const formatted = serverNFTs.map((n) => ({
          id: n._id,
          _id: n._id,
          title: n.title,
          price: `$${n.price}`,
          image: `${API}${n.imageUrl}`,
        }));
        setNfts((prev) => {
          const seen = new Set(prev.map((n) => n._id));
          return [...prev, ...formatted.filter((n) => !seen.has(n._id))];
        });
      } catch (err) {
        console.error("Error fetching NFTs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNFTs();
  }, []);

  const fetchShekelBalance = async (tok) => {
    try {
      const res = await fetch(`${API}/api/balance`, {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (res.ok) setShekelBalance(data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleNFTCreated = (newNFT) => {
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
    setCurrentPage("home");
  };

  const handleBuyNow = (nft) => {
    setSelectedNft(nft);
    setCurrentPage("buyNow");
  };

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setUsername(data.username || data.email);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setCurrentPage("home");
        fetchShekelBalance(data.token);
      } else {
        alert(data.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    }
  };

  const handleRegister = async ({ username, email, password, walletAddress }) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, walletAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful! Please log in.");
        setCurrentPage("login");
      } else {
        alert(data.message || "Registration error");
      }
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

  const renderHome = () => (
    <div className="px-10 py-10 text-center">
      <h1 className="text-4xl md:text-5xl font-nacelle bg-gradient-to-r from-indigo-500 to-indigo-200 text-transparent bg-clip-text mb-3">
        Shekel Scheme
      </h1>
      <p className="text-indigo-200/70 mb-6">NFTs for people with questionable morals.</p>
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
        <div className="grid gap-x-20 gap-y-20 md:grid-cols-2 lg:grid-cols-3 px-40">
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
              <h3 className="text-3xl font-semibold text-white mb-1">{nft.title}</h3>
              <p className="text-indigo-200 text-xl mb-3">Price: {nft.price}</p>
              <button
                onClick={() => handleBuyNow(nft)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition duration-300 bg-gradient-to-t from-indigo-600 to-indigo-500 text-white hover:bg-[length:100%_150%] w-full"
              >
                Buy Now
              </button>
              <Comments nftId={nft._id} token={token} isLoggedIn={isLoggedIn} />
            </div>
          ))}
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
            onSuccess={(newBalance) => setShekelBalance(newBalance)}
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
        return <Account user={{ username, shekelTokens: shekelBalance, token }} />;
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

function Navbar({ navigateTo, isLoggedIn, username, balance, onLogout }) {
  return (
    <nav className="w-full flex justify-between items-center p-4 bg-gray-900">
      <span
        className="text-lg font-bold text-indigo-300 cursor-pointer"
        onClick={() => navigateTo("home")}
      >
        Shekel Scheme
      </span>
      {isLoggedIn ? (
        <div className="flex items-center gap-3">
          <span className="text-indigo-100 text-sm">
            Welcome, {username} | {balance} Shekel Coins
          </span>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
            onClick={() => navigateTo("account")}
          >
            Account
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
            onClick={() => navigateTo("addFunds")}
          >
            Add Funds
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
            onClick={() => navigateTo("create")}
          >
            Create NFT
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
            onClick={() => navigateTo("login")}
          >
            Login
          </button>
          <button
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-medium text-sm bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:opacity-90"
            onClick={() => navigateTo("register")}
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}

export default App;
