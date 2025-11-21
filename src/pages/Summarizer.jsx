// src/pages/Summarizer.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import { extractTextFromImage } from "../utils/ocr";
import { summarizeText } from "../utils/summarizer";
import { supabase } from "../lib/supabaseClient";
import "../styles/summarizer.css";

export default function Summarizer() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    checkSession();

    // Optional: subscribe to auth changes so UI updates on login/logout
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleUpload(file) {
    if (!user) return navigate("/login");
    setUploading(true);
    setStatusMsg("");
    try {
      const extracted = await extractTextFromImage(file);
      setInput((prev) => (prev ? prev + "\n\n" + extracted : extracted));
      setStatusMsg("Text extracted and appended to input.");
    } catch (err) {
      console.error("OCR error:", err);
      setStatusMsg("Error extracting text from the file.");
    } finally {
      setUploading(false);
    }
  }

  async function runSummarizer() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!input.trim()) {
      alert("Please enter or upload text first.");
      return;
    }

    setLoading(true);
    setStatusMsg("Generating summary...");
    setSummary("");

    try {
      const output = await summarizeText(input);
      setSummary(output);
      setStatusMsg("Saving summary to your account...");

      // Insert into summaries table and return inserted row
      const { data, error } = await supabase
        .from("summaries")
        .insert({
          user_id: user.id,
          input_text: input,
          summary: output,
        })
        .select()
        .single();

      if (error) {
        // Log full error object for debugging RLS / permission problems
        console.error("Supabase insert error:", error);
        setStatusMsg(
          "Failed to save summary to database: " + (error.message || "Unknown error")
        );
        // keep summary visible locally even if saving fails
      } else {
        console.log("Saved summary:", data);
        setStatusMsg("Summary saved successfully.");
      }
    } catch (err) {
      console.error("Summarizer or DB error:", err);
      setStatusMsg("Unexpected error. Check console for details.");
    } finally {
      setLoading(false);
      // keep focus on summary area so user can see result
    }
  }

  return (
    <div className="summarizer-page">
      <h1 className="summarizer-title">AI Text Summarizer</h1>
      <p className="summarizer-subtitle">
        Paste text or upload an image/PDF to extract text automatically.
      </p>

      <div className="summarizer-upload-card">
        <h3 className="upload-title">Upload Image / PDF</h3>

        {!user ? (
          <p className="login-warning">
            🔒 You must{" "}
            <span className="link-like" onClick={() => navigate("/login")}>
              log in
            </span>{" "}
            to upload or summarize.
          </p>
        ) : (
          <FileUploader onFile={handleUpload} />
        )}

        {uploading && <p className="summarizer-loading">Extracting text…</p>}

        <textarea
          className="textarea"
          placeholder="Paste text here or upload a document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!user || uploading || loading}
        />

        <button
          onClick={runSummarizer}
          className={`btn ${!user ? "btn-disabled" : ""}`}
          disabled={!user || loading || uploading}
        >
          {loading ? "Summarizing..." : "Summarize Text"}
        </button>

        {statusMsg && <p className="status-msg">{statusMsg}</p>}
      </div>

      {summary && (
        <div className="summarizer-output-card">
          <h3 className="output-title">Summary</h3>
          <p className="output-text" style={{ whiteSpace: "pre-line" }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
