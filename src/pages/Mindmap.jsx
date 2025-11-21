// src/pages/Mindmap.jsx
import { useState } from "react";
import FileUploader from "../components/FileUploader";
import MindMapGenerator from "../components/MindMapGenerator";
import { extractTextFromImage } from "../utils/ocr";
import { convertTextToMindmap } from "../utils/mindmapParser";
import "../styles/mindmap.css";

export default function Mindmap() {
  const [mindmap, setMindmap] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    setMindmap(null);

    const text = await extractTextFromImage(file);
    const mm = await convertTextToMindmap(text);

    setMindmap(mm);
    setLoading(false);
  };

  return (
    <div className="mindmap-page">

      {/* Title */}
      <h1 className="mindmap-title">Mind Map Generator</h1>
      <p className="mindmap-subtitle">
        Upload an image or scanned document — AI will extract content and generate a clean visual mind map.
      </p>

      {/* Upload Section */}
      <div className="mindmap-upload-box">
        <FileUploader onFile={handleUpload} />

        {loading && <p className="mindmap-loading">Generating mind map…</p>}
      </div>

      {/* Result */}
      {mindmap && (
        <div className="mindmap-result-box">
          <MindMapGenerator mindmap={mindmap} />
        </div>
      )}
    </div>
  );
}
