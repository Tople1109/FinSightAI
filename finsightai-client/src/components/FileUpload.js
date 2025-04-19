import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post("http://localhost:5050/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUploadComplete(response.data.message);
      setError(""); // Clear error
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Network error: Make sure the backend is running at http://localhost:5050");
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload PDF</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FileUpload;
