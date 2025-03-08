import React, { useState } from 'react';

function CreateNFT({ onNFTCreated }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/upload/nft', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onNFTCreated(data);
        setTitle('');
        setPrice('');
        setImage(null);
        setPreview('');
      } else {
        throw new Error('Failed to upload NFT');
      }
    } catch (error) {
      console.error('Error uploading NFT:', error);
      alert('Failed to upload NFT. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New NFT</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">NFT Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                {preview && (
                  <div className="mb-3 text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  Create NFT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNFT;
