// src/components/MindMapGenerator.jsx
import React, { useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";

import { radialSmartLayout } from "../utils/radialLayout";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { supabase } from "../lib/supabaseClient";

import "reactflow/dist/style.css";

// ---------------- COLOR PALETTE ------------------
const COLORS = {
  root: "#FFE8A8",
  branch: ["#C9F2FF", "#FFD6E8", "#D6FFD9", "#FFF4C9", "#E7D6FF"],
  child: "#FFFFFF",
  border: "#B5B5B5",
  edge: "#8AB4F8",
};

function MindMapInner({ mindmap }) {
  const ref = useRef();
  const { fitView } = useReactFlow();

  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    if (!mindmap?.topic) return;

    const layout = radialSmartLayout(mindmap, 650, 420, 260, 180);

    // ADD COLORS
    const coloredNodes = layout.nodes.map((node) => {
      if (node.id === "root") {
        return {
          ...node,
          style: {
            background: COLORS.root,
            padding: 12,
            borderRadius: 12,
            border: "2px solid #FFCF5C",
            fontWeight: "bold",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          },
        };
      }

      if (node.data?.type === "branch") {
        const color =
          COLORS.branch[node.data.branchIndex % COLORS.branch.length];

        return {
          ...node,
          style: {
            background: color,
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
          },
        };
      }

      return {
        ...node,
        style: {
          background: COLORS.child,
          padding: 6,
          borderRadius: 6,
          border: `1px solid ${COLORS.border}`,
        },
      };
    });

    const coloredEdges = layout.edges.map((e) => ({
      ...e,
      style: { stroke: COLORS.edge, strokeWidth: 1.5 },
    }));

    setNodes(coloredNodes);
    setEdges(coloredEdges);

    setTimeout(() => fitView({ padding: 0.35 }), 100);

    saveMindmapToDB(mindmap, coloredNodes, coloredEdges);
  }, [mindmap]);

  // ---------------- SAVE TO DATABASE ------------------
  async function saveMindmapToDB(mm, nodes, edges) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("mindmaps").insert({
        user_id: user.id,
        title: mm.topic,
        mindmap_json: {
          topic: mm.topic,
          nodes,
          edges,
        },
      });
    } catch (err) {
      console.error("DB save error:", err.message);
    }
  }

  const savePNG = async () => {
    const canvas = await html2canvas(ref.current);
    canvas.toBlob((blob) => saveAs(blob, "mindmap.png"));
  };

  const savePDF = async () => {
    const canvas = await html2canvas(ref.current);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [canvas.width, canvas.height]);
    pdf.addImage(img, "PNG", 0, 0);
    pdf.save("mindmap.pdf");
  };

  return (
    <>
      <div className="flex gap-2 p-4 justify-center">
        <button
          onClick={savePNG}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Download PNG
        </button>

        <button
          onClick={savePDF}
          className="px-5 py-2 bg-purple-600 text-white rounded-lg"
        >
          Download PDF
        </button>
      </div>

      <div
        ref={ref}
        style={{
          width: "100%",
          height: "700px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
        }}
      >
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background gap={25} size={2} color="#e5e5e5" />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

export default function MindMapGenerator({ mindmap }) {
  return (
    <ReactFlowProvider>
      <MindMapInner mindmap={mindmap} />
    </ReactFlowProvider>
  );
}
