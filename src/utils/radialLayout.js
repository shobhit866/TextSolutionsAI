// 📌 Collision-free radial layout for mind maps
export function radialSmartLayout(mindmap, centerX, centerY, baseRadius = 250, childDistance = 160) {
  const nodes = [];
  const edges = [];

  const rootId = "root";
  nodes.push({
    id: rootId,
    data: { label: mindmap.topic },
    position: { x: centerX, y: centerY }
  });

  // --- Helper: Estimate node width based on text ---
  function estimateWidth(text) {
    return Math.min(260, Math.max(80, text.length * 7.2));
  }

  // --- Helper: simple rectangle collision check ---
  function overlaps(a, b) {
    return !(
      a.x + a.w < b.x ||
      a.x > b.x + b.w ||
      a.y + a.h < b.y ||
      a.y > b.y + b.h
    );
  }

  const placed = []; // store bounding boxes to avoid overlap
  const branchAngleStep = (2 * Math.PI) / mindmap.branches.length;

  mindmap.branches.forEach((branch, i) => {
    const angle = i * branchAngleStep;
    let radius = baseRadius;
    const branchId = `b-${i}`;

    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);

    let box = {
      x: x - 60,
      y: y - 25,
      w: estimateWidth(branch.name),
      h: 40
    };

    // --- Move outward until no collision ---
    while (placed.some((p) => overlaps(p, box))) {
      radius += 40;
      x = centerX + radius * Math.cos(angle);
      y = centerY + radius * Math.sin(angle);

      box.x = x - box.w / 2;
      box.y = y - box.h / 2;
    }

    placed.push(box);

    // Add main branch node
    nodes.push({
      id: branchId,
      data: { label: branch.name },
      position: { x, y }
    });

    edges.push({ id: `e-${rootId}-${branchId}`, source: rootId, target: branchId });

    // -----------------------------------------------------------------
    // CHILDREN — arrange as mini-fans around branch node
    // -----------------------------------------------------------------
    const childAngleStart = angle - Math.PI / 5;
    const childAngleStep = (Math.PI / 2) / Math.max(1, branch.children.length - 1);

    branch.children.forEach((child, j) => {
      const childId = `c-${i}-${j}`;
      let cAngle = childAngleStart + j * childAngleStep;
      let cRadius = childDistance;

      let cx = x + cRadius * Math.cos(cAngle);
      let cy = y + cRadius * Math.sin(cAngle);

      let cBox = {
        x: cx - 70,
        y: cy - 25,
        w: estimateWidth(child),
        h: 40
      };

      // Auto push outward until collision-free
      while (placed.some((p) => overlaps(p, cBox))) {
        cRadius += 30;
        cx = x + cRadius * Math.cos(cAngle);
        cy = y + cRadius * Math.sin(cAngle);

        cBox.x = cx - cBox.w / 2;
        cBox.y = cy - cBox.h / 2;
      }

      placed.push(cBox);

      nodes.push({
        id: childId,
        data: { label: child },
        position: { x: cx, y: cy }
      });

      edges.push({ id: `e-${branchId}-${childId}`, source: branchId, target: childId });
    });
  });

  return { nodes, edges };
}
