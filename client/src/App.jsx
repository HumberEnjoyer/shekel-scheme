// App.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';


function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedNft, setSelectedNft] = useState(null);

  // Example NFT data
  const placeholderNFTs = [
    { id: 1, title: "Art", image: "/cow.png", price: "$50" },
    { id: 2, title: "Digital Wonder", image: "/duck.png", price: "$70" },
    { id: 3, title: "Modern Portrait", image: "/fish.png", price: "$100" },
    { id: 4, title: "Zebra", image: "/zebra.png", price: "$25" },
    { id: 5, title: "Proboscis", image: "/monkey.png", price: "$45" },
    { id: 6, title: "Shekel", image: "/shekel.png", price: "$95" },
  ];

  // Switch to buy page
  const handleBuyNow = (nft) => {
    setSelectedNft(nft);
    setCurrentPage("buyNow");
  };

  // Switch back to home
  const goBack = () => {
    setCurrentPage("home");
  };

  // If user clicked “Buy Now”, show the BuyNow screen
  if (currentPage === "buyNow") {
    return (
      <>
        <Navbar />
        <BuyNow nft={selectedNft} goBack={goBack} />
      </>
    );
  }

  // Otherwise, show Home with NFT grid
  return (
    <>
      <Navbar />
      <div className="container my-5 text-center ">
        <header className="mb-5">
          <h1 style={{ fontFamily: "'Pacifico', cursive" }}>Shekel Scheme</h1>
          <p className="lead">NFTs for people with questionable morals.</p>
        </header>
        <div className="row ">
          {placeholderNFTs.map((nft) => (
            <div key={nft.id} className="col-md-4 mb-4 ">
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
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <a className="navbar-brand" href="/">
          Shekel Scheme
        </a>
      </div>
    </nav>
  );
}

export default App;
