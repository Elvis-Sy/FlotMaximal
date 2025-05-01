import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  EdgeChange,
  NodeChange,
  ReactFlow,
  ReactFlowInstance
} from '@xyflow/react';
import { ConnectionMode, NodeBase, EdgeBase } from '@xyflow/system';
import React, { useCallback, useEffect, useRef } from 'react';
import { generateNodes } from '../utils/generateFlow';


interface assistedFlowComponentProps {
  setNodes: (nodes: any) => void;
  edges: any[];
  nodes: any[];
  setEdges: (edges: any) => void;
  nodesInput: String;
  isCalculating: boolean;
  maxFlow: number | null;
  error: String | null;
}

const AssistedFlowComponent: React.FC<assistedFlowComponentProps> = ({
  setNodes,
  edges,
  nodes,
  setEdges,
  nodesInput,
  isCalculating,
  maxFlow,
  error
}) => {

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (reactFlowInstance.current) {
      reactFlowInstance.current.fitView({ padding: 0.2, includeHiddenNodes: true });
    }
  }, [nodes, edges]);

  // Nettoyage des edges animés si le composant est démonté
  useEffect(() => {
    return () => {
      if (isCalculating) {
        setEdges((prevEdges: any[]) => prevEdges.map(edge => ({
          ...edge,
          animated: false
        })));
      }
    };
  }, [isCalculating]);

  // Intégration de NodesGenerator
  useEffect(() => {
    if (nodesInput) {
      generateNodes(nodesInput.split(''), setNodes, setEdges, edges);
    }
  }, [nodesInput, setNodes, setEdges, edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds: NodeBase[]) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds: EdgeBase[]) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div className="w-full md:w-2/3 relative h-[400px] md:h-auto overflow-hidden" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.Loose}
        fitView
        onInit={(instance) => (reactFlowInstance.current = instance)}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {error && (
        <div className="absolute bottom-10 md:bottom-36 right-6 w-fit md:left-auto z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {error}
        </div>
      )}

      {maxFlow !== null && (
        <div className="absolute top-4 right-4 bg-[#166cb7] text-white p-4 rounded-lg shadow-lg">
          Flot Maximal: <strong>{maxFlow}</strong>
        </div>
      )}
    </div>
  );
};

export default AssistedFlowComponent;
