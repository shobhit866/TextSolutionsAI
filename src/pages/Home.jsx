// src/pages/Home.jsx
import "../styles/home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">

      {/* Title Area */}
      <div className="home-header">
        <h1 className="home-title">Welcome to <span>TextSolutionsAI</span></h1>
        <p className="home-subtitle">
          A powerful set of AI tools to simplify complex documents, extract insights, 
          generate mind maps, and chat with an intelligent assistant — all in one place.
        </p>
      </div>

      {/* Features Section */}
      <div className="features-section">

        <Link to="/summarizer" className="feature-card">
          <div className="feature-icon">📝</div>
          <h3 className="feature-title">AI Text Summarizer</h3>
          <p className="feature-desc">
            Upload documents or paste text and get clean, point-wise summaries instantly.
          </p>
        </Link>

        <Link to="/mindmap" className="feature-card">
          <div className="feature-icon">🧠</div>
          <h3 className="feature-title">Mind Map Generator</h3>
          <p className="feature-desc">
            Convert messy text into beautiful, structured visual mind maps automatically.
          </p>
        </Link>

        <Link to="/chatbot" className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3 className="feature-title">AI Chat Assistant</h3>
          <p className="feature-desc">
            Ask questions, get explanations, and chat with your personal AI helper anytime.
          </p>
        </Link>

      </div>

      {/* Extra CTA Section */}
      <div className="cta-box">
        <h2>Start exploring your AI-powered toolkit 🚀</h2>
        <p>
          Whether you're analyzing reports, generating visual diagrams, or seeking help — 
          our tools are designed to save time and boost clarity.
        </p>
      </div>

    </div>
  );
}
