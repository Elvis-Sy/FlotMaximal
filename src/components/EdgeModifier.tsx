import React, { useEffect } from 'react';

type Node = {
  id: string;
  data: {
    label: string;
  };
};

type Edge = {
  id: string;
  source: string;
  target: string;
  label: number;
};

type EdgeModifierProps = {
  edges: Edge[];
  nodes: Node[];
  updateEdgeLabel: (edgeId: string, newLabel: number) => void;
};

const EdgeModifier: React.FC<EdgeModifierProps> = ({ edges, nodes, updateEdgeLabel }) => {
  const sortedEdges = [...edges].sort((a, b) => {
    const sourceA = nodes.find(n => n.id === a.source)?.data.label || '';
    const sourceB = nodes.find(n => n.id === b.source)?.data.label || '';
    return sourceA.localeCompare(sourceB);
  });

  const getColumnCount = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return Math.min(4, Math.max(2, Math.ceil(sortedEdges.length / 4)));
  };

  const numColumns = getColumnCount();
  const edgesPerColumn = Math.ceil(sortedEdges.length / numColumns);
  const columns = Array.from({ length: numColumns }, (_, i) => 
    sortedEdges.slice(i * edgesPerColumn, (i + 1) * edgesPerColumn)
  );

  useEffect(() => {
    const handleEdgeUpdate = (edge: Edge) => {
      const currentEdge = edges.find(e => e.id === edge.id);
      if (currentEdge && currentEdge.label !== edge.label) {
        updateEdgeLabel(edge.id, edge.label);
      }
    };

    edges.forEach(handleEdgeUpdate);
  }, [edges, updateEdgeLabel]);

  const handleCapacityChange = (edgeId: string, value: number) => {
    updateEdgeLabel(edgeId, value);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-[#166cb7] my-4">Capacités des arêtes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((columnEdges, columnIndex) => (
          <div key={columnIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dest.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cap.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {columnEdges.map((edge) => {
                  const sourceNode = nodes.find((n) => n.id === edge.source);
                  const targetNode = nodes.find((n) => n.id === edge.target);
                  
                  if (!sourceNode || !targetNode) return null;

                  return (
                    <tr key={edge.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{sourceNode.data.label}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{targetNode.data.label}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={(edge.label ?? "0").toString().split("/").pop()}
                          onChange={(e) => handleCapacityChange(edge.id, parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EdgeModifier;