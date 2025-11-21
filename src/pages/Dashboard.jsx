// src/pages/Dashboard.jsx
import "../styles/dashboard.css";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [mindmaps, setMindmaps] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const { data: session } = await supabase.auth.getUser();
      const authUser = session?.user;
      setUser(authUser);
      if (!authUser) return;

      // load profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("username, email")
        .eq("id", authUser.id)
        .single();
      setProfile(prof);

      // load summaries
      const { data: s } = await supabase
        .from("summaries")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });
      setSummaries(s || []);

      // load mindmaps
      const { data: m } = await supabase
        .from("mindmaps")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });
      setMindmaps(m || []);
    }

    loadData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome Back, <span>{profile?.username || profile?.email}</span> 👋
      </h1>

      <p className="dashboard-subtitle">
        Access your tools, history, and saved AI content.
      </p>

      {/* Feature Cards */}
      <div className="dashboard-grid">
        <a href="/summarizer" className="dash-card">
          <h3>📝 Text Summarizer</h3>
          <p>Generate summaries instantly.</p>
        </a>

        <a href="/mindmap" className="dash-card">
          <h3>🧠 Mind Map Generator</h3>
          <p>Create visual mind maps.</p>
        </a>

        <a href="/chatbot" className="dash-card">
          <h3>🤖 AI Chat Assistant</h3>
          <p>Ask anything.</p>
        </a>
      </div>

      {/* History */}
      <h2 className="history-title">📜 Your Activity History</h2>

      <div className="history-section">
        {/* Summaries */}
        <div className="history-box">
          <h3>📝 Saved Summaries</h3>

          {summaries.length === 0 ? (
            <p className="empty-text">No summaries saved yet.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => (
                  <tr key={s.id}>
                    <td>{s.summary.slice(0, 60)}...</td>
                    <td>{new Date(s.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedSummary(s)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mindmaps */}
        <div className="history-box">
          <h3>🧠 Saved Mind Maps</h3>

          {mindmaps.length === 0 ? (
            <p className="empty-text">No mind maps yet.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {mindmaps.map((m) => (
                  <tr key={m.id}>
                    <td>{m.title}</td>
                    <td>{new Date(m.created_at).toLocaleString()}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => navigate(`/view-mindmap/${m.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {selectedSummary && (
        <div className="modal-overlay" onClick={() => setSelectedSummary(null)}>
          <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Summary</h3>
            <p>{selectedSummary.summary}</p>
            <button
              className="close-btn"
              onClick={() => setSelectedSummary(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
