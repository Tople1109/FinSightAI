import React, { useState } from "react";
import axios from "axios";

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF first.");

    const formData = new FormData();
    formData.append("pdf", file);

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5050/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      console.log("✅ Full response:", res.data);
      console.log("📦 Summary from backend:", res.data.summary);

      onUploadComplete(res.data);
      setError("");
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Upload failed. Backend might not be running.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload PDF</button>

      {isLoading && <p style={{ color: "orange" }}>⏳ Processing PDF…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FileUpload;
