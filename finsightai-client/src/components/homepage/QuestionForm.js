import React, { useState } from "react";
import axios from "axios";

export default function QuestionForm() {
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [question, setQuestion] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      const { data } = await axios.post("http://localhost:5050/ask", {
        question,
      });
      setChatHistory(
        data.history || [...chatHistory, { question, answer: data.answer }]
      );
      localStorage.setItem("chatHistory", JSON.stringify(data.history || []));
      setQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <input
        type="text"
        placeholder="Ask a question about the report"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        style={{ width: 400 }}
      />
      <button onClick={handleAsk}>Ask</button>

      <div style={{ marginTop: 20 }}>
        <h3>Chat History</h3>
        <ul>
          {chatHistory.map((item, i) => (
            <li key={i}>
              <strong>Q:</strong> {item.question}
              <br />
              <strong>A:</strong> {item.answer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
