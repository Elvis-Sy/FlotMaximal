import { Edge, Node, Position } from "@xyflow/react";

export function generateNodes(
  countOrLetters: number | string[],
  setNodes: (nodesUpdater: (nodes: Node[]) => Node[]) => void,
  setEdges: (edges: Edge[]) => void,
  edges: Edge[] = []
) {
  const useLetters = Array.isArray(countOrLetters);
  const count = useLetters ? countOrLetters.length : countOrLetters;

  const containerWidth = window.innerWidth - 200;
  const centerX = containerWidth * 0.7;
  const centerY = window.innerHeight / 2 - 100;
  const baseSpacing = 30;
  const expansionFactor = Math.max(1, count / 8);
  const spacing = baseSpacing * expansionFactor;

  setNodes((prevNodes) => {
    const newNodes: Node[] = [];

    const existingStart = prevNodes.find((n) => n.id === "start");
    newNodes.push(
      existingStart || {
        id: "start",
        data: { label: "α" },
        position: { x: centerX - spacing * 10, y: centerY },
        className: "bg-green-500 rounded-full flex items-center justify-center",
        style: { width: 40, height: 40 },
        sourcePosition: Position.Right,
        type: "input",
      }
    );

    const existingEnd = prevNodes.find((n) => n.id === "end");
    newNodes.push(
      existingEnd || {
        id: "end",
        data: { label: "ω" },
        position: { x: centerX + spacing * 10, y: centerY },
        className: "bg-red-500 rounded-full flex items-center justify-center",
        style: { width: 40, height: 40 },
        targetPosition: Position.Left,
        type: "output",
      }
    );

    for (let i = 0; i < count; i++) {
      const id = useLetters ? countOrLetters[i] : (i + 1).toString();
      const label = useLetters ? id : String.fromCharCode(65 + i);
      const existing = prevNodes.find((n) => n.id === id);
      if (existing) {
        newNodes.push(existing);
        continue;
      }

      const nodesPerRing = 8;
      const ring = Math.floor(i / nodesPerRing);
      const indexInRing = i % nodesPerRing;

      const angle =
        indexInRing * (2 * Math.PI / nodesPerRing) +
        (ring % 2 === 0 ? 0 : Math.PI / nodesPerRing);
      const radius = 75 + ring * spacing;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const jitter = 10;
      const randomX = x + (Math.random() - 0.5) * jitter;
      const randomY = y + (Math.random() - 0.5) * jitter;

      newNodes.push({
        id,
        data: { label },
        position: { x: randomX, y: randomY },
        className: "bg-blue-500 rounded-full flex items-center justify-center",
        style: { width: 40, height: 40 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: false,
      });
    }

    return newNodes;
  });

  if (!useLetters) {
    setEdges(
      edges.filter((edge) => {
        const sourceValid = edge.source === "start" || parseInt(edge.source) <= count;
        const targetValid = edge.target === "end" || parseInt(edge.target) <= count;
        return sourceValid && targetValid;
      })
    );
  }
}
