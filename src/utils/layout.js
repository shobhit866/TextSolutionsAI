import dagre from "dagre";

const g = new dagre.graphlib.Graph();
g.setDefaultEdgeLabel(() => ({}));

export function autoLayout(nodes, edges, direction = "LR") {
  g.setGraph({
    rankdir: direction,
    nodesep: 50,    // reduce horizontal spacing
    ranksep: 70,    // reduce vertical spacing
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 180, height: 45 }); // smaller nodes for tighter map
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  // Normalize center alignment
  let minX = Infinity;
  let minY = Infinity;

  nodes.forEach((node) => {
    const pos = g.node(node.id);
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
  });

  const newNodes = nodes.map((node) => {
    const pos = g.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x - minX + 50, // shift everything close to top-left
        y: pos.y - minY + 50,
      },
      targetPosition: "left",
      sourcePosition: "right",
    };
  });

  return { nodes: newNodes, edges };
}
