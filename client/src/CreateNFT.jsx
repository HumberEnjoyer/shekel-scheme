import React, { useState } from 'react';

// create nft component to allow users to create and upload new nfts
function CreateNFT({ onNFTCreated }) {
  // state to store the nft title
  const [title, setTitle] = useState('');

  // state to store the nft price
  const [price, setPrice] = useState('');

  // state to store the uploaded image file
  const [image, setImage] = useState(null);

  // state to store the preview of the uploaded image
  const [preview, setPreview] = useState('');

  // state to store error messages
  const [error, setError] = useState('');

  // state to store success messages
  const [success, setSuccess] = useState('');

  // retrieve the logged-in user from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // function to handle image file selection and preview generation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // function to handle the form submission for creating an nft
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check if the user is logged in
    if (!user || !user.token) {
      setError("You must be logged in to create NFTs.");
      return;
    }

    // prepare form data for the nft creation request
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('description', 'Auto-generated NFT');

    try {
      // send a request to the server to create the nft
      const response = await fetch('http://localhost:5000/upload/nft', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      // handle success or error response from the server
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

  // render the create nft form
  return (
    <div className="min-h-screen bg-[#0f0f1b] flex items-center justify-end px-[42.5rem] py-20">
      <div className="w-full max-w-5xl bg-gray-900 p-16 rounded-2xl shadow-2xl">
        <h2 className="text-5xl font-bold text-center text-white mb-12">
          Create New NFT
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl ml-auto">
          {/* input field for nft title */}
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

          {/* input field for nft price */}
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

          {/* input field for nft image */}
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

          {/* preview of the uploaded image */}
          {preview && (
            <div className="text-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-52 mx-auto rounded-lg border border-gray-700"
              />
            </div>
          )}

          {/* display error message if any */}
          {error && <div className="text-red-400 text-base">{error}</div>}

          {/* display success message if any */}
          {success && <div className="text-green-400 text-base">{success}</div>}

          {/* submit button to create nft */}
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