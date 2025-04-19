import React, { useEffect, useState } from "react";

function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100" style={{ padding: "10px 40px" }}>
      <div className="container-fluid d-flex justify-content-between">
        <a className="navbar-brand fw-bold" href="/">
          Shekel Scheme
        </a>
        {user ? (
          <div className="d-flex align-items-center gap-2">
            <span className="navbar-text text-light me-3">Welcome, {user.username}</span>
            <span className="navbar-text text-light me-3">Shekel Tokens: {user.shekelTokens}</span>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <a className="btn btn-outline-light" href="/login">
              Login
            </a>
            <a className="btn btn-outline-light" href="/register">
              Register
            </a>
          </div>
        )}
      </div>
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
    return <p>Please log in to view your account.</p>;
  }

  return (
    <>
      <Navbar user={user} />
      <div className="container my-5">
        <h2>Your Purchased NFTs</h2>
        <div className="row">
          {purchasedNFTs.map((nft) => (
            <div className="col-md-4" key={nft._id}>
              <div className="card">
                <img src={nft.image} className="card-img-top" alt={nft.title} />
                <div className="card-body">
                  <h5 className="card-title">{nft.title}</h5>
                  <p className="card-text">Price: {nft.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Account;