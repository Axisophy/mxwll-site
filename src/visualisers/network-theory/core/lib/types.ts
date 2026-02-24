export interface Node {
  id: number;
  x: number;
  y: number;
  degree: number;
  state: 'normal' | 'removed' | 'susceptible' | 'infected' | 'recovered';
}

export interface Edge {
  source: number;
  target: number;
}

export interface Network {
  nodes: Node[];
  edges: Edge[];
  type: 'random' | 'scale-free' | 'small-world';
}

export interface NetworkMetrics {
  avgDegree: number;
  maxDegree: number;
  clusteringCoeff: number;
  avgPathLength: number;
  largestComponent: number;
  isolatedNodes: number;
}
