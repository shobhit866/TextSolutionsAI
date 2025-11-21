// src/pages/ViewMindmap.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import ReactFlow, { ReactFlowProvider, Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

export default function ViewMindmap() {
  const { id } = useParams();
  const [mindmap, setMindmap] = useState(null);

  useEffect(() => {
    async function loadMindmap() {
      const { data, error } = await supabase
        .from("mindmaps")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return console.error(error);

      let mm = data?.mindmap_json;

      if (typeof mm === "string") {
        try {
          mm = JSON.parse(mm);
        } catch {}
      }

      setMindmap(mm);
    }

    loadMindmap();
  }, [id]);

  if (!mindmap) return <p style={{ padding: 20 }}>Loading mindmap…</p>;

  return (
    <div style={{ height: "85vh", padding: "20px" }}>
      <h2 style={{ marginBottom: 10 }}>{mindmap.topic || "Mind Map"}</h2>

      <ReactFlowProvider>
        <ReactFlow nodes={mindmap.nodes} edges={mindmap.edges} fitView>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
