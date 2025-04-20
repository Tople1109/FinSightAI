import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionForm.css"; // <- Add this

export default function QuestionForm() {
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [question, setQuestion] = useState("");

  useEffect(() => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      const { data } = await axios.post("http://localhost:5050/ask", {
        question,
      });

      let history = [];

      if (Array.isArray(data.history)) {
        for (let i = 0; i < data.history.length - 1; i += 2) {
          const q = data.history[i];
          const a = data.history[i + 1];
          if (q.type === "human" && a.type === "ai") {
            history.push({
              question: q.data?.content ?? "Q?",
              answer: a.data?.content ?? "A?",
            });
          }
        }
      } else {
        history = [...chatHistory, { question, answer: data.answer }];
      }

      setChatHistory(history);
      localStorage.setItem("chatHistory", JSON.stringify(history));
      setQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="question-form">
      <input
        type="text"
        placeholder="Ask a question about the report"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
      />
      <button onClick={handleAsk}>Ask</button>

      {chatHistory.length > 0 && (
        <div>
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
      )}
    </div>
  );
}
