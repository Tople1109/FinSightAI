import React, { useState } from 'react';
import axios from 'axios';

function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    try {
      const response = await axios.post("http://localhost:5050/ask", { question });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("Ask request failed:", error);
      if (error.response?.data?.error) {
        setAnswer("Error: " + error.response.data.error);
      } else {
        setAnswer("Error: Could not connect to backend.");
      }
    }
  };

  return (
    <div>
      <input 
        type="text"
        placeholder="Ask a question about the report"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk}>Ask</button>
      <p><strong>Answer:</strong> {answer}</p>
    </div>
  );
}

export default QuestionForm;
