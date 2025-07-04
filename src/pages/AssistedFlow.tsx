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
    const spacingX = 180;
    const spacingY = 100;
    const startX = 100;
    const startY = 100;
  
    const occupied: Record<number, Set<number>> = {}; // colonne => lignes utilisées
    const gridPositions: Record<string, { col: number; row: number }> = {};
    const placed = new Set<string>();
  
    // Fonction pour positionner un nœud à une colonne et une ligne disponibles
    const placeNode = (id: string, col: number, preferredRow?: number) => {
      if (!occupied[col]) occupied[col] = new Set();
      let row = preferredRow ?? 0;
  
      while (occupied[col].has(row)) {
        row++;
      }
  
      occupied[col].add(row);
      gridPositions[id] = { col, row };
      placed.add(id);
    };
  
    // 1. Placer le nœud de départ "start"
    placeNode("start", 0, 0);
  
    // 2. Placement des enfants en BFS
    const queue: string[] = ["start"];
  
    while (queue.length > 0) {
      const current = queue.shift()!;
      const parentPos = gridPositions[current];
      if (!parentPos) continue;
  
      const children = edges
        .filter((e) => e.source === current)
        .map((e) => e.target)
        .filter((child) => !placed.has(child));
  
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
  
        // Tous les enfants sont dans la même colonne que leur parent
        const childCol = parentPos.col + 1; // peut rester +1 pour meilleure lisibilité horizontale
        const preferredRow = i === 0 ? parentPos.row : undefined; // aligné Y pour le 1er enfant
  
        placeNode(child, childCol, preferredRow);
        queue.push(child);
      }
    }
  
    // 3. Placer les nœuds non connectés
    let fallbackCol = Math.max(...Object.values(gridPositions).map((p) => p.col), 0);
    for (const node of nodes) {
      const { id } = node;
      if (id === "start" || id === "end" || placed.has(id)) continue;
  
      fallbackCol++;
      placeNode(id, fallbackCol);
    }
  
    // 4. Placer le puits "end" à la colonne la plus à droite + 1
    const allNodeIds = nodes.map((n) => n.id).filter((id) => id !== "end");
    const maxCol = Math.max(...allNodeIds.map((id) => gridPositions[id]?.col ?? 0));
    placeNode("end", maxCol + 1);
  
    // 5. Appliquer les positions x, y avec transition
    const newNodes = nodes.map((node) => {
      const pos = gridPositions[node.id];
      if (!pos) return node;
  
      return {
        ...node,
        position: {
          x: startX + pos.col * spacingX,
          y: startY + pos.row * spacingY,
        },
        style: {
          ...node.style,
          transition: "all 0.1s ease",
        },
      };
    });
  
    setNodes(newNodes);
  };
  
  
  
  
  

  const calculateMaxFlow = useCallback(() => {
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
      <h1 className='text-2xl text-gray-800 py-4 pl-6 font-bold underline font-transcity tracking-wider'>Mode Assisté</h1>
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
        
          <AssistedFlowComponent 
            nodes={nodes} 
            setNodes={setNodes} 
            edges={edges} 
            setEdges={setEdges} 
            nodesInput={nodesInput} 
            isCalculating={isCalculating} 
            maxFlow={maxFlow} 
            error={error}/>
        
      </div>
    </ContentWrapper>
    
  );
}

export default AssistedFlow;