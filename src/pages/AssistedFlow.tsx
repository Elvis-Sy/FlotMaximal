import { useCallback, useState } from 'react';
import { Edge } from '@xyflow/react';
import AssistedFlowComponent from '../components/AssistedFlowComponent';
import '@xyflow/react/dist/style.css';
import ContentWrapper from '../components/ContentWrapper';
import { calculateMaxFlow as calculationUtil} from '../utils/calculateFlow';
import SetupPanel from '../components/SetupPanel';

const AssistedFlow =()=> {

  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [nodesInput, setNodesInput] = useState('');
  const [currentEdge, setCurrentEdge] = useState({ from: '', to: '', capacity: 1 });
  const [maxFlow, setMaxFlow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<any[] | null>(null);
  const [showGraph, setShowGraph] = useState(false);

  const handleAddEdge = (from: string, to: string, capacity: number) => {
    const newEdge = {
      id: `${from}-${to}`,
      source: from,
      target: to,
      type: 'custom',
      label: `0/${capacity}`,
      animated: false,
      style: { stroke: '#64748b' },
      markerEnd: { type: "arrowclosed" },
    };
    setMaxFlow(null);
    setEdges((prev: any) => [...prev, newEdge]);
  };

  const handleEditEdge = (edge: Edge) => {
    const capacity = parseInt(edge.label?.toString().split('/')[1] || '1');
    setCurrentEdge({
      from: edge.source,
      to: edge.target,
      capacity
    });
    setMaxFlow(null);
    setEdges((prev: any[]) => prev.filter((e: { id: any; }) => e.id !== edge.id));
  };

  const handleReset = () => {
    setEdges([]);
    setNodes([]);
    setNodesInput('');
    setMaxFlow(null);
    setCurrentEdge({ from: '', to: '', capacity: 1 });
    setError(null);
    setShowGraph(false);
  };


  const validateFlowNetwork = useCallback(() => {
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

    // for (const edge of edges) {
    //   const capacity = parseInt((edge.label ?? "0").toString().split("/").pop() || "0");
    //   if (isNaN(capacity) || capacity <= 0) {
    //     return "Toutes les capacités doivent être des nombres positifs";
    //   }
    // }

    return null;
  }, [nodes, edges]);

  const rearrangeNodesByLevel = () => {
    const levels: Record<string, number> = {};
    const visited: Set<string> = new Set();
    const queue: Array<{ id: string; level: number }> = [{ id: 'start', level: 0 }];
  
    // 1. BFS pour calculer les niveaux depuis la source
    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      levels[id] = level;
  
      const children = edges.filter(edge => edge.source === id).map(edge => edge.target);
      for (const child of children) {
        if (!visited.has(child)) {
          queue.push({ id: child, level: level + 1 });
        }
      }
    }
  
    // 2. Grouper les noeuds par niveau
    const levelsToNodes: Record<number, string[]> = {};
    for (const nodeId in levels) {
      const lvl = levels[nodeId];
      if (!levelsToNodes[lvl]) levelsToNodes[lvl] = [];
      levelsToNodes[lvl].push(nodeId);
    }
  
    // Trouver le niveau max pour savoir combien de colonnes
    const maxLevel = Math.max(...Object.values(levels));
    const spacingX = 200;
    const spacingY = 100;
  
    // Centrage horizontal basé sur le nombre de niveaux
    const totalWidth = (maxLevel + 2) * spacingX; // +2 pour marges
    const offsetX = window.innerWidth / 2 - totalWidth / 2;
  
    // 3. Repositionner les noeuds
    const newNodes = nodes.map((node) => {
      let level = levels[node.id] ?? 0;
  
      // Forcer le nœud "end" à aller au niveau max + 1
      if (node.id === 'end') {
        level = maxLevel + 1;
      }
  
      const nodesAtLevel = level === (maxLevel + 1)
        ? ['end']
        : levelsToNodes[level] || [];
  
      const index = nodesAtLevel.indexOf(node.id);
  
      return {
        ...node,
        position: {
          x: offsetX + level * spacingX,
          y: index * spacingY + 50
        }
      };
    });
  
    setNodes(newNodes);
  };
  

  const calculateMaxFlow = useCallback(() => {
    setShowGraph(true);
    rearrangeNodesByLevel();
    calculationUtil(
      nodes,
      edges,
      setError,
      setMaxFlow,
      setIsCalculating,
      setEdges,        
      setEdges,        
      setCurrentPath,
      validateFlowNetwork
    );
  }, [nodes, edges, setError, setMaxFlow, setIsCalculating, setEdges, setCurrentPath]);

  return (
    
    <ContentWrapper>
      <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 md:border-r border-b md:border-b-0 border-gray-200 md:overflow-auto">
          <SetupPanel
            nodesInput={nodesInput}
            setNodesInput={setNodesInput}
            currentEdge={currentEdge}
            setCurrentEdge={setCurrentEdge}
            onAddEdge={handleAddEdge}
            onReset={handleReset}
            nodes={nodes}
            setNodes={setNodes}
            setEdges={setEdges}
            edges={edges}
            onValidate={calculateMaxFlow}
            onEditEdge={handleEditEdge}
          />
        </div>
        
        {showGraph && (
          <AssistedFlowComponent 
            nodes={nodes} 
            setNodes={setNodes} 
            edges={edges} 
            setEdges={setEdges} 
            nodesInput={nodesInput} 
            isCalculating={isCalculating} 
            maxFlow={maxFlow} 
            error={error}/>
        )}
        
      </div>
    </ContentWrapper>
    
  );
}

export default AssistedFlow;