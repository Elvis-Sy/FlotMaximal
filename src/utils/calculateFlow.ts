// utils/flowUtils.ts
import { Edge } from '@xyflow/react';
import { Graph } from '../types';
import { findAllPaths, findImprovingPath, markVertices, getPathMinCapacity, applyFlow } from './fordFulkerson'; // Assurez-vous que ces utilitaires sont bien définis

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getEdgeStyle = (flow: number, capacity: number, isInPath: boolean) => {
    const style = {
      strokeWidth: isInPath ? 3 : 2,
    };

    if (flow === 0) {
      return { ...style, stroke: '#9ca3af' };
    } else if (flow === capacity) {
      return { ...style, stroke: '#ef4444' };
    }
    return { ...style, stroke: '#3b82f6' };
  };

export const calculateMaxFlow = async (
  nodes: any[],
  edges: any[],
  setError: (error: string | null) => void,
  setMaxFlow: (flow: number | null) => void,
  setIsCalculating: (isCalculating: boolean) => void,
  setFlowEdges: (edges: Edge[]) => void,
  handleEdgesChange: (edges: Edge[]) => void,
  setCurrentPath: (path: any[] | null) => void,
  validateFlow: () => null | string
) => {
  setError(null);
  const validationError = validateFlow();
  if (validationError) {
    setError(validationError);
    return;
  }

  setIsCalculating(true);
  setMaxFlow(null);

  const initialFlowEdges = edges.map(edge => ({
    ...edge,
    flowLabel: edge.label,
    animated: false,
    labelStyle: {
      fill: '#000',
      fontSize: 12,
      fontWeight: 700,
      background: 'white',
      padding: '4px',
      borderRadius: '4px',
      border: '1px solid #e5e7eb'
    }
  }));
  setFlowEdges(initialFlowEdges);

  const graph: Graph = {
    nodes: nodes.map(node => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
    })),
    edges: edges.map(edge => ({
      from: edge.source,
      to: edge.target,
      capacity: parseInt((edge.label ?? "0").toString().split("/").pop()!) || 0,
      flow: 0
    }))
  };

  let currentFlow = 0;
  const workingGraph = {
    ...graph,
    edges: graph.edges.map(edge => ({ ...edge, flow: 0 }))
  };

  let updatedFlowEdges = [...initialFlowEdges];

  while (true) {
    const selectedPath = findAllPaths(workingGraph, "start", "end");

    if (!selectedPath) break;

    const minResidual = Math.min(...selectedPath.map(e => e.capacity - e.flow));

    setCurrentPath(selectedPath);
    await sleep(1000);

    selectedPath.forEach(edge => {
      const residualEdge = workingGraph.edges.find(
        e => e.from === edge.from && e.to === edge.to
      );
      if (residualEdge) {
        residualEdge.flow += minResidual;
      }
    });

    currentFlow += minResidual;

    updatedFlowEdges = updatedFlowEdges.map(edge => {
      const residualEdge = workingGraph.edges.find(
        e => e.from === edge.source && e.to === edge.target
      );
      if (!residualEdge) return edge;

      const isInPath = selectedPath.some(
        p => p.from === edge.source && p.to === edge.target
      );

      return {
        ...edge,
        animated: isInPath,
        style: getEdgeStyle(residualEdge.flow, residualEdge.capacity, isInPath),
        label: `${residualEdge.flow}/${String(edge.label).split("/").pop()}`
      };
    });

    handleEdgesChange(updatedFlowEdges);
    setFlowEdges(updatedFlowEdges);

    await sleep(2000);
  }

  const markedNode = markVertices(workingGraph);
  if (!markedNode.has('end')) {
    setMaxFlow(currentFlow);
    setIsCalculating(false);
    return;
  }

  const improvingPath = findImprovingPath(workingGraph, markedNode);
  if (improvingPath) {
    const minCap = getPathMinCapacity(improvingPath, workingGraph);
    applyFlow(improvingPath, workingGraph, minCap);
    currentFlow += minCap;

    updatedFlowEdges = updatedFlowEdges.map(edge => {
      const newEdge = workingGraph.edges.find(
        e => e.from === edge.source && e.to === edge.target
      );
      return newEdge
        ? {
            ...edge,
            label: `${newEdge.flow}/${edge.label.split('/').pop()}`,
            animated: improvingPath.some(p => p.from === edge.source && p.to === edge.target),
            style: getEdgeStyle(newEdge.flow, newEdge.capacity, true)
          }
        : edge;
    });

    updatedFlowEdges = updatedFlowEdges.map(edge => ({
      ...edge,
      animated: false
    }));
    handleEdgesChange(updatedFlowEdges);
    setFlowEdges(updatedFlowEdges);
    setCurrentPath(improvingPath);
  }

  setCurrentPath(null);
  setMaxFlow(currentFlow);
  setIsCalculating(false);
};
