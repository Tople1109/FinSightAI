import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import QuestionForm from './components/QuestionForm';

function App() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AnnualGPT</h1>
      <FileUpload onUploadComplete={setMessage} />
      {message && <p>{message}</p>}
      <QuestionForm />
    </div>
  );
}

export default App;
