// src/components/FileUploader.jsx
import React from "react";

export default function FileUploader({ onFile }) {
  return (
    <div className="p-4 border rounded">
      <p className="font-semibold mb-2">Upload Image / PDF</p>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => onFile(e.target.files[0])}
      />
    </div>
  );
}
