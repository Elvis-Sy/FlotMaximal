export interface Node {
  id: string;
  x: number;
  y: number;
  isSource?: boolean;
  isSink?: boolean;
}

export interface Edge {
  [x: string]: any;
  from: string;
  to: string;
  capacity: number;
  flow: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface FlowEdge extends Edge {
  flowLabel?: string;
  animated?: boolean;
  labelStyle?: React.CSSProperties;
}

export interface Path {
  from: string;
  to: string;
  capacity: number;
  flow: number;
}