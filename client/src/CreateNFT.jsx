import React, { useState } from 'react';

function CreateNFT({ onNFTCreated }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.token) {
      setError("You must be logged in to create NFTs.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('description', 'Auto-generated NFT');

    try {
      const response = await fetch('http://localhost:5000/upload/nft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("NFT created successfully!");
        onNFTCreated(data);
        setTitle('');
        setPrice('');
        setImage(null);
        setPreview('');
        setError('');
      } else {
        setError(data.error || "Failed to create NFT.");
      }
    } catch (err) {
      console.error("Error uploading NFT:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[42.5rem] py-20">
      <div className="w-full max-w-5xl bg-gray-900 p-16 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center text-white mb-12">
          Create New NFT
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl ml-auto">
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter NFT title"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-6 py-4 text-lg rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-300 mb-2">
              NFT Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-400 bg-gray-800 border border-gray-700 rounded-md file:mr-4 file:py-3 file:px-6 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              required
            />
          </div>

          {preview && (
            <div className="text-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-52 mx-auto rounded-lg border border-gray-700"
              />
            </div>
          )}

          {error && <div className="text-red-400 text-base">{error}</div>}
          {success && <div className="text-green-400 text-base">{success}</div>}

          <button
            type="submit"
            className="w-full py-4 text-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Create NFT
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNFT;
