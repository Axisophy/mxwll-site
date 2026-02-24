import { Network, NetworkMetrics } from './types';

export function calculateMetrics(network: Network): NetworkMetrics {
  const { nodes, edges } = network;
  const n = nodes.length;

  // Degree statistics
  const degrees = nodes.map(node => node.degree);
  const avgDegree = degrees.reduce((a, b) => a + b, 0) / n;
  const maxDegree = Math.max(...degrees);

  // Build adjacency list
  const adj: Set<number>[] = nodes.map(() => new Set());
  edges.forEach(edge => {
    if (nodes[edge.source].state !== 'removed' && nodes[edge.target].state !== 'removed') {
      adj[edge.source].add(edge.target);
      adj[edge.target].add(edge.source);
    }
  });

  // Connected components (BFS)
  const visited = new Set<number>();
  const components: number[] = [];

  nodes.forEach((node, i) => {
    if (visited.has(i) || node.state === 'removed') return;

    let size = 0;
    const queue = [i];
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      size++;
      adj[current].forEach(neighbor => {
        if (!visited.has(neighbor) && nodes[neighbor].state !== 'removed') {
          queue.push(neighbor);
        }
      });
    }
    components.push(size);
  });

  const activeNodes = nodes.filter(n => n.state !== 'removed').length;
  const largestComponent = components.length > 0 ? Math.max(...components) / activeNodes : 0;
  const isolatedNodes = nodes.filter((n, i) => n.state !== 'removed' && adj[i].size === 0).length;

  // Clustering coefficient
  let totalClustering = 0;
  let countedNodes = 0;

  nodes.forEach((node, i) => {
    if (node.state === 'removed' || adj[i].size < 2) return;
    const neighbors = Array.from(adj[i]);
    let triangles = 0;
    for (let j = 0; j < neighbors.length; j++) {
      for (let k = j + 1; k < neighbors.length; k++) {
        if (adj[neighbors[j]].has(neighbors[k])) triangles++;
      }
    }
    const possible = (neighbors.length * (neighbors.length - 1)) / 2;
    totalClustering += triangles / possible;
    countedNodes++;
  });

  const clusteringCoeff = countedNodes > 0 ? totalClustering / countedNodes : 0;

  return {
    avgDegree,
    maxDegree,
    clusteringCoeff,
    avgPathLength: 0,
    largestComponent,
    isolatedNodes,
  };
}

export function getDegreeHistogram(network: Network): { degree: number; count: number }[] {
  const degrees = network.nodes
    .filter(n => n.state !== 'removed')
    .map(n => n.degree);

  if (degrees.length === 0) return [];

  const histogram: Map<number, number> = new Map();

  degrees.forEach(d => {
    histogram.set(d, (histogram.get(d) || 0) + 1);
  });

  return Array.from(histogram.entries())
    .map(([degree, count]) => ({ degree, count }))
    .sort((a, b) => a.degree - b.degree);
}
