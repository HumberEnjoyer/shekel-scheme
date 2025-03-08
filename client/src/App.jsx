import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Login from "./Login";
import Register from "./Register";
import BuyNow from "./BuyNow";
import CreateNFT from "./CreateNFT";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [nfts, setNfts] = useState([
    { id: 1, title: "Art", image: "/cow.png", price: "$50" },
    { id: 2, title: "Digital Wonder", image: "/duck.png", price: "$70" },
    { id: 3, title: "Modern Portrait", image: "/fish.png", price: "$100" },
    { id: 4, title: "Zebra", image: "/zebra.png", price: "$25" },
    { id: 5, title: "Proboscis", image: "/monkey.png", price: "$45" },
    { id: 6, title: "Shekel", image: "/shekel.png", price: "$95" },
  ]);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await fetch('http://localhost:5000/upload/nfts');
      if (response.ok) {
        const userNFTs = await response.json();
        setNfts(prevNfts => [...prevNfts, ...userNFTs]);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const handleNFTCreated = (newNFT) => {
    setNfts(prevNfts => [...prevNfts, newNFT]);
    setCurrentPage("home");
  };

  // Switch to buy page
  const handleBuyNow = (nft) => {
    setSelectedNft(nft);
    setCurrentPage("buyNow");
  };

  // Switch back to home
  const goBack = () => {
    setCurrentPage("home");
  };

  // Handle registration
  const handleRegister = (registerData) => {
    setUsers([...users, registerData]);
    setCurrentPage("login");
  };

  // Handle login
  const handleLogin = (loginData) => {
    const user = users.find(user => user.email === loginData.email && user.password === loginData.password);
    if (user) {
      setIsLoggedIn(true);
      setUsername(loginData.email);
      setCurrentPage("home");
    } else {
      alert("Invalid username or password");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrentPage("home");
  };

  // Render the appropriate page based on currentPage state
  if (currentPage === "buyNow") {
    return (
      <>
        <Navbar navigateTo={setCurrentPage} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <BuyNow nft={selectedNft} goBack={goBack} />
      </>
    );
  } else if (currentPage === "login") {
    return (
      <>
        <Navbar navigateTo={setCurrentPage} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <Login onLogin={handleLogin} />
      </>
    );
  } else if (currentPage === "register") {
    return (
      <>
        <Navbar navigateTo={setCurrentPage} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <Register onRegister={handleRegister} />
      </>
    );
  } else if (currentPage === "create") {
    return (
      <>
        <Navbar navigateTo={setCurrentPage} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <CreateNFT onNFTCreated={handleNFTCreated} />
      </>
    );
  }

  // Otherwise, show Home with NFT grid
  return (
    <>
      <Navbar navigateTo={setCurrentPage} isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <div className="container my-5 text-center">
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
        <div className="row">
          {nfts.map((nft) => (
            <div key={nft.id} className="col-md-4 mb-4">
              <div className="card h-100 home-hover">
                <img src={nft.image} className="card-img-top" alt={nft.title} />
                <div className="card-body">
                  <h5 className="card-title">{nft.title}</h5>
                  <p className="card-text">Price: {nft.price}</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleBuyNow(nft)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Basic Navbar
function Navbar({ navigateTo, isLoggedIn, username, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={() => navigateTo("home")}>
          Shekel Scheme
        </a>
        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            <span className="navbar-text text-light me-3">Welcome, {username}</span>
            <button className="btn btn-outline-light me-2" onClick={() => navigateTo("create")}>
              Create NFT
            </button>
            <button className="btn btn-outline-light" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <button className="btn btn-outline-light me-2" onClick={() => navigateTo("login")}>
              Login
            </button>
            <button className="btn btn-outline-light" onClick={() => navigateTo("register")}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default App;