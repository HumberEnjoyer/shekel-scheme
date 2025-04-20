import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import BuyNow from "./BuyNow";
import CreateNFT from "./CreateNFT";

const API = "http://localhost:5000"; 
function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);

  /* ------------------- authentication / session ------------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [shekelBalance, setShekelBalance] = useState(0);

  /* -------------------------- NFT state --------------------------- */
  const [nfts, setNfts] = useState([
    {
      id: 1,
      _id: "68046a559011bb59bc611b97",     
      title: "Art",
      image: "/cow.png",
      price: "$50"
    },
    {
      id: 2,
      _id: "68046b4a9011bb59bc611b9f",
      title: "Digital Wonder",
      image: "/duck.png",
      price: "$70"
    },
    {
      id: 3,
      _id: "68046b639011bb59bc611ba0",
      title: "Modern Portrait",
      image: "/fish.png",
      price: "$100"
    },
    {
      id: 4,
      _id: "68046b6c9011bb59bc611ba1",
      title: "Zebra",
      image: "/zebra.png",
      price: "$25"
    },
    {
      id: 5,
      _id: "68046b779011bb59bc611ba2",
      title: "Proboscis",
      image: "/monkey.png",
      price: "$45"
    },
    {
      id: 6,
      _id: "68046b7f9011bb59bc611ba3",
      title: "Shekel",
      image: "/shekel.png",
      price: "$95"
    }
  ]);
  const [loading, setLoading] = useState(true);

  /* ----------------------- restore session ------------------------ */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      setIsLoggedIn(true);
      setUsername(storedUser.username || storedUser.email);
      setToken(storedUser.token);
      fetchShekelBalance(storedUser.token);
    }
  }, []);

  /* -------------------- fetch NFTs from server -------------------- */
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const res = await fetch(`${API}/upload/nfts`);
        if (!res.ok) throw new Error("Failed to fetch NFTs");
        const serverNFTs = await res.json();

        const formatted = serverNFTs.map((n) => ({
          id: n._id,
          _id: n._id,
          title: n.title,
          price: `$${n.price}`,
          image: `${API}${n.imageUrl}`,
        }));

        // merge without duplicating existing showcase NFTs
        setNfts((prev) => {
          const seen = new Set(prev.filter((x) => x._id).map((x) => x._id));
          const newOnes = formatted.filter((n) => !seen.has(n._id));
          return [...prev, ...newOnes];
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

  /* ------------------- handlers passed to children ---------------- */
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
  const goBack = () => setCurrentPage("home");

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
        localStorage.setItem("user", JSON.stringify({
          token: data.token, username: data.username, email: data.email,
        }));
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setToken(null);
    localStorage.removeItem("user");
    setCurrentPage("home");
  };
  const handleRegister = () => setCurrentPage("login");

  /* ----------------------------- views ---------------------------- */
  if (currentPage === "buyNow") {
    return (
      <>
        <Navbar {...{ navigateTo:setCurrentPage,isLoggedIn,username,balance:shekelBalance,onLogout:handleLogout }} />
        <BuyNow nft={selectedNft} goBack={goBack} isLoggedIn={isLoggedIn} token={token} />
      </>
    );
  }
  if (currentPage === "login") {
    return (
      <>
        <Navbar {...{ navigateTo:setCurrentPage,isLoggedIn,username,balance:shekelBalance,onLogout:handleLogout }} />
        <Login onLogin={handleLogin} />
      </>
    );
  }
  if (currentPage === "register") {
    return (
      <>
        <Navbar {...{ navigateTo:setCurrentPage,isLoggedIn,username,balance:shekelBalance,onLogout:handleLogout }} />
        <Register onRegister={handleRegister} />
      </>
    );
  }
  if (currentPage === "create") {
    return (
      <>
        <Navbar {...{ navigateTo:setCurrentPage,isLoggedIn,username,balance:shekelBalance,onLogout:handleLogout }} />
        <CreateNFT onNFTCreated={handleNFTCreated} />
      </>
    );
  }

  /* ---------------------------- home page ------------------------- */
  return (
    <>
      <Navbar {...{ navigateTo:setCurrentPage,isLoggedIn,username,balance:shekelBalance,onLogout:handleLogout }} />

      <div className="main-content-wrapper">
        <div className="container text-center">
          <header className="mb-5">
            <h1 style={{ fontFamily: "'Pacifico', cursive" }}>Shekel Scheme</h1>
            <p className="lead">NFTs for people with questionable morals.</p>

            {isLoggedIn && (
              <button className="btn btn-success mb-4" onClick={() => setCurrentPage("create")}>
                Create New NFT
              </button>
            )}
          </header>

          {loading ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <div className="row justify-content-center g-4">
              {nfts.map((nft) => (
                <div key={nft.id} className="col-12 col-md-4">
                  <div className="card h-100 home-hover">
                    <img src={nft.image} className="card-img-top" alt={nft.title} />
                    <div className="card-body">
                      <h5 className="card-title">{nft.title}</h5>
                      <p className="card-text">Price: {nft.price}</p>
                      <button className="btn btn-primary w-100" onClick={() => handleBuyNow(nft)}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ----------------------------- Navbar ---------------------------- */
function Navbar({ navigateTo, isLoggedIn, username, balance, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100" style={{ padding: "10px 40px" }}>
      <div className="container-fluid d-flex justify-content-between">
        <a className="navbar-brand fw-bold" href="#" onClick={() => navigateTo("home")}>Shekel Scheme</a>

        {isLoggedIn ? (
          <div className="d-flex align-items-center gap-2">
            <span className="navbar-text text-light me-3">
              Welcome, {username} | {balance} Shekel Coins
            </span>
            <button className="btn btn-outline-light me-2" onClick={() => navigateTo("create")}>Create NFT</button>
            <button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light" onClick={() => navigateTo("login")}>Login</button>
            <button className="btn btn-outline-light" onClick={() => navigateTo("register")}>Register</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default App;
