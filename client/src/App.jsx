import { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  // set a handler for submission
  const handleSubmitTextForm = async (e) => {
    e.preventDefault();

    try {
      const submission = { username, password };
      console.log(submission);

      const response = await fetch(`http://localhost:8000/text-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log(data);
      setMessage(JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitMultiPartForm = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("image", image);

      console.log("Submitting FormData:", formData);

      const response = await fetch("http://localhost:8000/form-multipart", {
        method: "POST",
        body: formData, // Do NOT set Content-Type (Browser does it)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      console.log("Upload Response:", data);
      setMessage(JSON.stringify(data, null, 2));
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div>
      <h1>Text Form</h1>
      <form onSubmit={handleSubmitTextForm}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
      <p>---------------------------------------</p>

      <h1>MultiPart Form</h1>
      <form onSubmit={handleSubmitMultiPartForm}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};

export default App;
