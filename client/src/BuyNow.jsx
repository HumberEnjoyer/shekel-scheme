import React from "react";

function BuyNow({ nft, goBack }) {
  return (
    <div className="container my-5">
      <button className="btn btn-secondary mb-3" onClick={goBack}>
        Back
      </button>
      <div className="card">
        <img src={nft.image} className="card-img-top" alt={nft.title} />
        <div className="card-body">
          <h5 className="card-title">{nft.title}</h5>
          <p className="card-text">Price: {nft.price}</p>
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default BuyNow;