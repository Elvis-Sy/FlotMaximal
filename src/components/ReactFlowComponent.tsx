import { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  EdgeChange,
  Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodesGenerator from "./NodesGenerator";
import { calculateMaxFlow as calculationUtil} from "../utils/calculateFlow";
import { Play } from "lucide-react";

interface ReactFlowComponentProps {
  fieldValue: number;
  setNodes: (nodes: any[]) => void;
  edges: any[];
  setEdges: (edges: any[]) => void;
}

const ReactFlowComponent: React.FC<ReactFlowComponentProps> = ({ 
  fieldValue, 
  setNodes: setParentNodes,
  edges,
  setEdges: setParentEdges
}) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [maxFlow, setMaxFlow] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState<any[] | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [flowEdges, setFlowEdges] = useState<any[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!isCalculating) {
      setFlowEdges(edges);
    }
  }, [edges, isCalculating]);

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

  const handleNodesChange = useCallback((newNodes: any[]) => {
    setNodes(newNodes);
    setParentNodes(newNodes);
  }, [setParentNodes]);

  const handleEdgesChange = useCallback((newEdges: any[]) => {
    if (!isCalculating) {
      setParentEdges(newEdges);
      setFlowEdges(newEdges);
    } else {
      setFlowEdges(newEdges);
    }
  }, [setParentEdges, isCalculating]);

  const applyRepulsion = useCallback(() => {
    const minDistance = 50;
    const repulsionStrength = 15;
    const damping = 0.6;

    setNodes(currentNodes => {
      let hasMovement = false;
      const newNodes = currentNodes.map(node => {
        let dx = 0;
        let dy = 0;

        currentNodes.forEach(otherNode => {
          if (node.id !== otherNode.id) {
            const deltaX = node.position.x - otherNode.position.x;
            const deltaY = node.position.y - otherNode.position.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < minDistance) {
              const force = (minDistance - distance) / distance * repulsionStrength;
              const exponentialFactor = Math.exp(-(distance / minDistance));
              dx += deltaX * force * exponentialFactor;
              dy += deltaY * force * exponentialFactor;
              hasMovement = true;
            }
          }
        });

        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return node;

        const maxSpeed = 20;
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > maxSpeed) {
          dx = (dx / speed) * maxSpeed;
          dy = (dy / speed) * maxSpeed;
        }

        dx *= damping;
        dy *= damping;

        return {
          ...node,
          position: {
            x: node.position.x + dx,
            y: node.position.y + dy
          }
        };
      });

      if (hasMovement) {
        animationFrameRef.current = requestAnimationFrame(applyRepulsion);
      }

      return newNodes;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const onNodesChange = useCallback(
    (changes: any[]) => {
      const newNodes = applyNodeChanges(changes, nodes);
      handleNodesChange(newNodes);
      
      const dragChange = changes.find((change: { type: string; }) => change.type === 'position');
      if (dragChange) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        applyRepulsion();
      }
    },
    [nodes, handleNodesChange, applyRepulsion]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<any>[]) => {
      const newEdges = applyEdgeChanges(changes, flowEdges);
      handleEdgesChange(newEdges);
    },
    [flowEdges, handleEdgesChange]
  );

  const onConnect = useCallback(
    (params: { source: any; target: any; }) => {
      const edgeExists = flowEdges.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      
      if (!edgeExists) {
        const newEdge = {
          ...params,
          label: "0",
          markerEnd: { type: "arrowclosed" },
          animated: false,
          style: { stroke: '#9ca3af' },
          labelStyle: { 
            fill: '#000',
            fontSize: 12,
            fontWeight: 700,
            background: 'white',
            padding: '4px',
            borderRadius: '4px',
            border: '1px solid #e5e7eb'
          }
        };
        handleEdgesChange(addEdge(newEdge, flowEdges));
      }
    },
    [flowEdges, handleEdgesChange]
  );

  const onEdgeDoubleClick = useCallback((event: { preventDefault: () => void; }, edge: { id: any; }) => {
    event.preventDefault();
    handleEdgesChange(flowEdges.filter((e) => e.id !== edge.id));
    setMaxFlow(null);
  }, [flowEdges, handleEdgesChange]);

  const onNodeDoubleClick = useCallback((event: { preventDefault: () => void; }, node: { id: string; }) => {
    event.preventDefault();
  
    if (node.id !== "start" && node.id !== "end") {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
  
      const updatedEdges = flowEdges.filter(
        (e: { source: string; target: string }) => e.source !== node.id && e.target !== node.id
      );
  
      handleEdgesChange(updatedEdges);
      setMaxFlow(null);
    }
  }, [flowEdges, handleEdgesChange]);

  const validateFlowNetwork = () => {
    
    const intermediateNodes = nodes.filter(node => node.id !== "start" && node.id !== "end");
    
    for (const node of intermediateNodes) {
      const hasIncomingEdge = edges.some(edge => edge.target === node.id);
      const hasOutgoingEdge = edges.some(edge => edge.source === node.id);
      
      if (!hasIncomingEdge || !hasOutgoingEdge) {
        return `Le nœud ${node.data.label} doit avoir au moins une arête entrante et une arête sortante`;
      }
    }

    // Vérifier si la source a au moins une arête sortante
    const sourceHasEdge = edges.some(edge => edge.source === "start");
    if (!sourceHasEdge) {
      return "La source (α) doit avoir au moins une arête sortante";
    }

    // Vérifier si le puits a au moins une arête entrante
    const sinkHasEdge = edges.some(edge => edge.target === "end");
    if (!sinkHasEdge) {
      return "Le puits (ω) doit avoir au moins une arête entrante";
    }

    for (const edge of edges) {
      const capacity = parseInt((edge.label ?? "0").toString().split("/").pop());
      if (isNaN(capacity) || capacity <= 0) {
        return "Toutes les capacités doivent être des nombres positifs";
      }
    }

    return null;
  };

  const calculateMaxFlow = useCallback(() => {
    calculationUtil(
      nodes,
      edges,
      setError,
      setMaxFlow,
      setIsCalculating,
      handleEdgesChange,        
      handleEdgesChange,        
      setCurrentPath,
      validateFlowNetwork
    );
  }, [nodes, edges, setError, setMaxFlow, setIsCalculating, handleEdgesChange, setCurrentPath]);
  
  

  const handleNodesChangeFromUpdater = useCallback(
    (updater: (nodes: Node[]) => Node[]) => {
      setNodes((prevNodes) => {
        const updated = updater(prevNodes);
        handleNodesChange(updated);
        return updated;
      });
    },
    [handleNodesChange]
  );

  return (
    <div className="h-full relative">
      <NodesGenerator
        fieldValue={fieldValue}
        setNodes={handleNodesChangeFromUpdater}
        setEdges={handleEdgesChange}
        edges={edges}
       />
      <ReactFlow
        nodes={nodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.5,
          maxZoom: 1.5
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-[90vw] z-10">
        <button
          onClick={calculateMaxFlow}
          disabled={isCalculating}
          className={`flex items-center w-fit gap-1 px-4 py-2 rounded-md text-white transition-colors ${
            isCalculating 
              ? 'bg-[#88f5ac] cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <Play size={18} className="mr-2" /> {isCalculating ? 'Calcul en cours...' : 'Calculer le Flot Max'}
        </button>
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        {maxFlow !== null && (
          <div className="mt-4 text-lg font-semibold text-gray-900">
            Flot Maximal : {maxFlow}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactFlowComponent;

function setEdges(arg0: (eds: any[]) => any[]) {
  throw new Error("Function not implemented.");
}
