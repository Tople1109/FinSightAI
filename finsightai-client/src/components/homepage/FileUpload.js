import React, { useRef, useState } from "react";
import axios from "axios";
import "./FileUpload.css";

export default function FileUpload({ onUploadComplete }) {
  const fileInputRef = useRef(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file) => {
    if (!file) return setError("Please select a PDF first.");

    const data = new FormData();
    data.append("pdf", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5050/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
        responseType: "text",
      });
      onUploadComplete(JSON.parse(res.data));
      setError("");
    } catch (e) {
      console.error(e);
      setError("Upload failed. Backend might not be running.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) upload(f);
  };

  return (
    <div className="file-upload-page">
      <main className="card">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? "Uploading…" : "Upload PDF"}
        </button>

        {isLoading && <p className="status info">⏳ Processing PDF…</p>}
        {error && <p className="status error">{error}</p>}

        <p className="note">
          Select a PDF to upload. Once uploaded, you’ll be able to ask questions
          about its contents.
        </p>
      </main>
    </div>
  );
}
