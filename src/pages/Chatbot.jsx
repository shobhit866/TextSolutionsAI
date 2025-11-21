// src/pages/Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/chatbot.css";

// 🧹 Clean Markdown Output (removes **, *, _, `, ##, etc.)
function cleanMarkdown(text) {
  return text
    .replace(/\*\*/g, "")     // remove bold markers
    .replace(/\*/g, "")       // remove bullet markers
    .replace(/#/g, "")        // remove heading marks
    .replace(/_/g, "")        // remove italics
    .replace(/`/g, "")        // remove code backticks
    .replace(/\n+/g, " ")     // remove weird newlines
    .trim();
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Load logged-in user
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    checkUser();
  }, []);

  // Auto-scroll chat window
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!user) return navigate("/login");
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          import.meta.env.VITE_GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: userMsg.text }] }],
          }),
        }
      );

      const data = await res.json();

      let reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t understand that.";

      // 🧹 Clean markdown from reply
      reply = cleanMarkdown(reply);

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Error: Could not reach AI!" },
      ]);
    }

    setLoading(false);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-wrapper">
      <h1 className="chat-title">AI Chat Assistant</h1>
      <p className="chat-subtitle">Ask anything — powered by Gemini AI.</p>

      {!user && (
        <p className="chat-login-warning">
          🔒 You must{" "}
          <span onClick={() => navigate("/login")}>log in</span> to chat with AI.
        </p>
      )}

      {/* Chat Window */}
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-wrapper">
        <input
          className="chat-input"
          placeholder={user ? "Type your message…" : "Login required…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
          disabled={!user}
        />

        <button
          className={`chat-send-btn ${!user ? "disabled" : ""}`}
          onClick={sendMessage}
          disabled={!user}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
