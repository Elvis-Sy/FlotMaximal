import React, { useEffect } from 'react';
import { Edge, Node } from '@xyflow/react';
import { Play, RotateCcw, Edit2 } from 'lucide-react';

interface SetupPanelProps {
  nodesInput: string;
  setNodesInput: (value: string) => void;
  currentEdge: { from: string; to: string; capacity: number };
  setCurrentEdge: (edge: { from: string; to: string; capacity: number }) => void;
  onAddEdge: (from: string, to: string, capacity: number) => void;
  onReset: () => void;
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  edges: Edge[];
  onValidate: () => void;
  onEditEdge: (edge: Edge) => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({
  nodesInput,
  setNodesInput,
  currentEdge,
  setCurrentEdge,
  onAddEdge,
  onReset,
  nodes,
  setNodes,
  setEdges,
  edges,
  onValidate,
  onEditEdge
}) => {

  useEffect(() => {
    const validNodes = [...nodesInput.split(''), 'start', 'end'];
  
    const filteredEdges = edges.filter(
      (edge) => validNodes.includes(edge.source) && validNodes.includes(edge.target)
    );

    const filteredNodes = nodes.filter((node) => validNodes.includes(node.id));
  
    if (filteredEdges.length !== edges.length) {
      setEdges(filteredEdges);
    }

    if (filteredNodes.length !== nodes.length) {
      setNodes(filteredNodes);
    }
  }, [nodesInput]);

  const handleEdgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (
      currentEdge.from &&
      currentEdge.to &&
      currentEdge.from !== currentEdge.to &&
      currentEdge.capacity > 0
    ) {
      onAddEdge(currentEdge.from, currentEdge.to, currentEdge.capacity);
      setCurrentEdge({ from: '', to: '', capacity: 0 });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-6 text-[#166cb7]">Configuration du réseau</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nœuds (lettres uniquement, ex: ABCDE)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={nodesInput}
            onChange={(e) => setNodesInput(e.target.value.toUpperCase())}
            className="flex-1 p-2 border rounded-md"
            placeholder="ABCDE.."
          />
        </div>
      </div>

      <form onSubmit={handleEdgeSubmit} className="mb-6">
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">De</label>
            <div className="relative">
              <input
                list="fromNodes"
                value={currentEdge.from}
                onChange={(e) => {
                  const value = e.target.value;
                  const validNodes = ['start', ...nodesInput.split('')];
                  if (validNodes.includes(value) || value === '') {
                    setCurrentEdge({ ...currentEdge, from: value });
                  }
                }}
                className="w-full p-2 border rounded-md"
                placeholder="Sélectionner"
              />
              <datalist id="fromNodes">
                <option value="start">Source (α)</option>
                {nodesInput.split('').map(letter => (
                  <option key={`from-${letter}`} value={letter}>{letter}</option>
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vers</label>
            <div className="relative">
              <input
                list="toNodes"
                value={currentEdge.to}
                onChange={(e) => {
                  const value = e.target.value;
                  const validNodes = [...nodesInput.split(''), 'end'];
                  if (validNodes.includes(value) || value === '') {
                    setCurrentEdge({ ...currentEdge, to: value });
                  }
                }}
                className="w-full p-2 border rounded-md"
                placeholder="Sélectionner"
              />
              <datalist id="toNodes">
                {nodesInput.split('').map(letter => (
                  <option key={`to-${letter}`} value={letter}>{letter}</option>
                ))}
                <option value="end">Puits (ω)</option>
              </datalist>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
            <input
              type="number"
              value={currentEdge.capacity}
              onChange={(e) => setCurrentEdge({ ...currentEdge, capacity: parseInt(e.target.value) || 0 })}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={
            !currentEdge.from ||
            !currentEdge.to ||
            currentEdge.from === currentEdge.to ||
            currentEdge.capacity <= 0
          }
        >
          Ajouter l'arête
        </button>
      </form>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Arêtes:</h3>
        <div className="max-h-40 overflow-auto bg-gray-50 rounded-md p-2">
          {edges.map((edge) => (
            <div key={edge.id} className="flex items-center justify-between text-sm mb-1 p-2 hover:bg-gray-100 rounded">
              <span>
                {edge.source === 'start' ? 'α' : edge.source} → {edge.target === 'end' ? 'ω' : edge.target} 
                (capacité: {edge.label?.toString().split('/')[1]})
              </span>
              <button
                onClick={() => onEditEdge(edge)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                <Edit2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
        >
          <RotateCcw size={18} className="mr-2" />
          Réinitialiser
        </button>
        <button
          onClick={onValidate}
          className="flex-1 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <Play size={18} className="mr-2" />
          Valider
        </button>
      </div>
    </div>
  );
};

export default SetupPanel;