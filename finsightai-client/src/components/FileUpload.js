import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await axios.post("http://localhost:5000/upload", formData);
    onUploadComplete(response.data.message);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}

export default FileUpload;
