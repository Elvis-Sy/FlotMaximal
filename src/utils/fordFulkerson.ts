import { Graph, Edge } from '../types';

export function findAllPaths(graph: Graph, source: string, sink: string): Edge[] | null {
  const allPaths = getBestPath(graph, source, sink);

  if (allPaths.length === 0) return null;

  // Étape 1 : trouver la capacité minimale parmi tous les chemins
  const minCapacity = Math.min(...allPaths.map(path =>
    Math.min(...path.map(edge => edge.capacity - edge.flow))
  ));

  // Étape 2 : filtrer les chemins qui ont cette capacité minimale
  const filteredPaths = allPaths.filter(path =>
    Math.min(...path.map(edge => edge.capacity - edge.flow)) === minCapacity
  );

  // Étape 3 : choisir le chemin le plus court
  filteredPaths.sort((a, b) => a.length - b.length);
  return filteredPaths[0];
}

//Trouver tous les chemins valides (DFS)
export function getBestPath(
  graph: Graph,
  source: string,
  sink: string,
  visited: Set<string> = new Set(),
  path: Edge[] = [],
  paths: Edge[][] = []
): Edge[][] {
  if (source === sink) {
    paths.push([...path]);
    return paths;
  }

  visited.add(source);

  for (const edge of graph.edges) {
    if (edge.from === source && !visited.has(edge.to) && edge.capacity > edge.flow) {
      getBestPath(graph, edge.to, sink, new Set(visited), [...path, edge], paths);
    }
  }

  return paths;
}

// Marquage des sommets
export function markVertices(graph: Graph): Set<string> {
  const marked = new Set<string>();
  const queue: string[] = ['start'];
  marked.add('start');

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const edge of graph.edges) {
      // arc non saturé dans le sens direct
      if (edge.from === current && edge.capacity > edge.flow && !marked.has(edge.to)) {
        marked.add(edge.to);
        queue.push(edge.to);
      }

      // arc avec flux dans le sens inverse
      if (edge.to === current && edge.flow > 0 && !marked.has(edge.from)) {
        marked.add(edge.from);
        queue.push(edge.from);
      }
    }
  }

  return marked;
}

// Chemin améliorant basé sur les sommets marqués
export function findImprovingPath(graph: Graph, marked: Set<string>): Edge[] | null {
  const visited = new Set<string>();
  const path: Edge[] = [];

  function dfs(node: string): boolean {
    if (node === 'end') return true;
    visited.add(node);

    for (const edge of graph.edges) {
      if (edge.from === node && marked.has(edge.to) && edge.capacity > edge.flow && !visited.has(edge.to)) {
        path.push(edge);
        if (dfs(edge.to)) return true;
        path.pop();
      }
      if (edge.to === node && marked.has(edge.from) && edge.flow > 0 && !visited.has(edge.from)) {
        path.push({ from: edge.to, to: edge.from, capacity: edge.flow, flow: -1 });
        if (dfs(edge.from)) return true;
        path.pop();
      }
    }

    return false;
  }

  return dfs('start') ? path : null;
}

export function getPathMinCapacity(path: Edge[], graph: Graph): number {
  return Math.min(
    ...path.map(e =>
      e.flow === -1
        ? graph.edges.find(edge => edge.from === e.to && edge.to === e.from)!.flow
        : e.capacity - e.flow
    )
  );
}

export function applyFlow(path: Edge[], graph: Graph, minCap: number): void {
  for (const edge of path) {
    if (edge.flow === -1) {
      const rev = graph.edges.find(e => e.from === edge.to && e.to === edge.from);
      if (rev) rev.flow -= minCap;
    } else {
      const fwd = graph.edges.find(e => e.from === edge.from && e.to === edge.to);
      if (fwd) fwd.flow += minCap;
    }
  }
}
