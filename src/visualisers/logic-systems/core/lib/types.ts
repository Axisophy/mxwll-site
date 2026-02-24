export type GateType = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'INPUT' | 'OUTPUT';

export interface Gate {
  id: string;
  type: GateType;
  x: number;
  y: number;
  inputs: string[];  // IDs of connected gates
  value?: boolean;
}

export interface Connection {
  from: string;
  to: string;
  toInput: number;  // Which input port (0 or 1)
}

export interface Circuit {
  gates: Gate[];
  connections: Connection[];
}

export interface Point2D {
  x: number;
  y: number;
  label: 0 | 1;
}

export type ModelType = 'linear' | 'polynomial' | 'knn' | 'rbf';
