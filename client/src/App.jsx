import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import BuyNow from "./BuyNow";
import CreateNFT from "./CreateNFT";
import AddFunds from "./AddFunds"
import Comments from "./Comments"

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(null);
  const [shekelBalance, setShekelBalance] = useState(0);
  const [nfts, setNfts] = useState([
    { id: 1, title: "Art", image: "/cow.png", price: "$50" },
    { id: 2, title: "Digital Wonder", image: "/duck.png", price: "$70" },
    { id: 3, title: "Modern Portrait", image: "/fish.png", price: "$100" },
    { id: 4, title: "Zebra", image: "/zebra.png", price: "$25" },
    { id: 5, title: "Proboscis", image: "/monkey.png", price: "$45" },
    { id: 6, title: "Shekel", image: "/shekel.png", price: "$95" },
  ]);

  // Restore session on initial load
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
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const res = await fetch("http://localhost:3000/upload/nfts");
      if (res.ok) {
        const userNFTs = await res.json();
        setNfts((prev) => [...prev, ...userNFTs]);
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    }
  };

  const fetchShekelBalance = async (tok) => {
    try {
      const res = await fetch("http://localhost:3000/api/balance", {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const data = await res.json();
      if (res.ok) setShekelBalance(data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleNFTCreated = (newNFT) => {
    setNfts((prev) => [...prev, newNFT]);
    setCurrentPage("home");
  };

  const handleBuyNow = (nft) => {
    setSelectedNft(nft);
    setCurrentPage("buyNow");
  };

  const goBack = () => setCurrentPage("home");

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setUsername(data.username || data.email);
        setToken(data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: data.token,
            username: data.username,
            email: data.email,
          })
        );
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

  if (currentPage === "buyNow") {
    return (
      <>
        <Navbar
          navigateTo={setCurrentPage}
          isLoggedIn={isLoggedIn}
          username={username}
          balance={shekelBalance}
          onLogout={handleLogout}
        />
        <BuyNow
          nft={selectedNft}
          goBack={goBack}
          isLoggedIn={isLoggedIn}
          token={token}
        />
      </>
    );
  } else if (currentPage === "login") {
    return (
      <>
        <Navbar
          navigateTo={setCurrentPage}
          isLoggedIn={isLoggedIn}
          username={username}
          balance={shekelBalance}
          onLogout={handleLogout}
        />
        <Login onLogin={handleLogin} />
      </>
    );
  } else if (currentPage === "register") {
    return (
      <>
        <Navbar
          navigateTo={setCurrentPage}
          isLoggedIn={isLoggedIn}
          username={username}
          balance={shekelBalance}
          onLogout={handleLogout}
        />
        <Register onRegister={handleRegister} />
      </>
    );
  } else if (currentPage === "create") {
    return (
      <>
        <Navbar
          navigateTo={setCurrentPage}
          isLoggedIn={isLoggedIn}
          username={username}
          balance={shekelBalance}
          onLogout={handleLogout}
        />
        <CreateNFT onNFTCreated={handleNFTCreated} />
      </>
    );
  } else if (currentPage === "addFunds") {
    return (
      <>
        <Navbar
          navigateTo={setCurrentPage}
          isLoggedIn={isLoggedIn}
          username={username}
          balance={shekelBalance}
          onLogout={handleLogout}
        />
        <AddFunds 
          token={token} 
          onSuccess={(newBalance) => {
            setShekelBalance(newBalance);
            setCurrentPage("home");
          }} 
        />
      </>
    );
  }

  return (
    <>
      <Navbar
        navigateTo={setCurrentPage}
        isLoggedIn={isLoggedIn}
        username={username}
        balance={shekelBalance}
        onLogout={handleLogout}
      />
      <div className="main-content-wrapper">
        <div className="container text-center">
          <header className="mb-5">
            <h1 style={{ fontFamily: "'Pacifico', cursive" }}>Shekel Scheme</h1>
            <p className="lead">NFTs for people with questionable morals.</p>
            {isLoggedIn && (
              <button
                className="btn btn-success mb-4"
                onClick={() => setCurrentPage("create")}
              >
                Create New NFT
              </button>
            )}
          </header>
          <div className="row justify-content-center g-4">
            {nfts.map((nft) => (
              <div key={nft.id} className="col-12 col-md-4">
                <div className="card h-100 home-hover">
                  <img
                    src={nft.image}
                    className="card-img-top"
                    alt={nft.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{nft.title}</h5>
                    <p className="card-text">Price: {nft.price}</p>
                    <button
                      className="btn btn-primary w-100 mb-3"
                      onClick={() => handleBuyNow(nft)}
                    >
                      Buy Now
                    </button>
                    <Comments 
                      nftId={nft.id} 
                      token={token}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Navbar({ navigateTo, isLoggedIn, username, balance, onLogout }) {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark w-100"
      style={{ padding: "10px 40px" }}
    >
      <div className="container-fluid d-flex justify-content-between">
        <a
          className="navbar-brand fw-bold"
          href="#"
          onClick={() => navigateTo("home")}
        >
          Shekel Scheme
        </a>
        {isLoggedIn ? (
          <div className="d-flex align-items-center gap-2">
            <span className="navbar-text text-light me-3">
              Welcome, {username} | {balance} Shekel Coins
            </span>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigateTo("create")}
            >
              Create NFT
            </button>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigateTo("addFunds")}
            >
              Add Funds
            </button>
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => navigateTo("login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-light"
              onClick={() => navigateTo("register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default App;
