import { Node, Edge, Network } from './types';

// Erdos-Renyi random graph
export function generateRandomNetwork(n: number, p: number = 0.1): Network {
  const nodes: Node[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    degree: 0,
    state: 'normal',
  }));

  const edges: Edge[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        edges.push({ source: i, target: j });
        nodes[i].degree++;
        nodes[j].degree++;
      }
    }
  }

  return { nodes, edges, type: 'random' };
}

// Barabasi-Albert scale-free network
export function generateScaleFreeNetwork(n: number, m: number = 2): Network {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Start with a small complete graph
  for (let i = 0; i < m + 1; i++) {
    nodes.push({ id: i, x: 0, y: 0, degree: m, state: 'normal' });
    for (let j = 0; j < i; j++) {
      edges.push({ source: i, target: j });
    }
  }

  // Add remaining nodes with preferential attachment
  for (let i = m + 1; i < n; i++) {
    nodes.push({ id: i, x: 0, y: 0, degree: 0, state: 'normal' });

    const totalDegree = nodes.reduce((sum, node) => sum + node.degree, 0);
    const targets = new Set<number>();

    while (targets.size < m) {
      let r = Math.random() * totalDegree;
      for (let j = 0; j < i; j++) {
        r -= nodes[j].degree;
        if (r <= 0 && !targets.has(j)) {
          targets.add(j);
          break;
        }
      }
    }

    targets.forEach(target => {
      edges.push({ source: i, target });
      nodes[i].degree++;
      nodes[target].degree++;
    });
  }

  return { nodes, edges, type: 'scale-free' };
}

// Watts-Strogatz small-world network
export function generateSmallWorldNetwork(n: number, k: number = 4, p: number = 0.1): Network {
  const nodes: Node[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    degree: 0,
    state: 'normal',
  }));

  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  const addEdge = (i: number, j: number) => {
    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (!edgeSet.has(key) && i !== j) {
      edgeSet.add(key);
      edges.push({ source: i, target: j });
      nodes[i].degree++;
      nodes[j].degree++;
    }
  };

  // Create ring lattice
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= k / 2; j++) {
      addEdge(i, (i + j) % n);
    }
  }

  // Rewire edges with probability p
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= k / 2; j++) {
      if (Math.random() < p) {
        const oldTarget = (i + j) % n;
        let newTarget: number;
        do {
          newTarget = Math.floor(Math.random() * n);
        } while (newTarget === i || edgeSet.has(i < newTarget ? `${i}-${newTarget}` : `${newTarget}-${i}`));

        // Remove old edge
        const oldKey = i < oldTarget ? `${i}-${oldTarget}` : `${oldTarget}-${i}`;
        edgeSet.delete(oldKey);
        nodes[i].degree--;
        nodes[oldTarget].degree--;

        // Add new edge
        addEdge(i, newTarget);
      }
    }
  }

  return { nodes, edges, type: 'small-world' };
}

// Force-directed layout
export function applyForceLayout(network: Network, width: number, height: number, iterations: number = 100): Network {
  const { nodes, edges } = network;
  const n = nodes.length;

  // Initialize random positions
  nodes.forEach(node => {
    node.x = width / 2 + (Math.random() - 0.5) * width * 0.8;
    node.y = height / 2 + (Math.random() - 0.5) * height * 0.8;
  });

  const k = Math.sqrt((width * height) / n);

  for (let iter = 0; iter < iterations; iter++) {
    const temp = 1 - iter / iterations;

    // Repulsion between all nodes
    for (let i = 0; i < n; i++) {
      let dx = 0, dy = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const diffX = nodes[i].x - nodes[j].x;
        const diffY = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(diffX * diffX + diffY * diffY) || 1;
        const force = (k * k) / dist;
        dx += (diffX / dist) * force;
        dy += (diffY / dist) * force;
      }
      nodes[i].x += dx * temp * 0.1;
      nodes[i].y += dy * temp * 0.1;
    }

    // Attraction along edges
    edges.forEach(edge => {
      const source = nodes[edge.source];
      const target = nodes[edge.target];
      const diffX = target.x - source.x;
      const diffY = target.y - source.y;
      const dist = Math.sqrt(diffX * diffX + diffY * diffY) || 1;
      const force = (dist * dist) / k;
      const fx = (diffX / dist) * force * temp * 0.1;
      const fy = (diffY / dist) * force * temp * 0.1;
      source.x += fx;
      source.y += fy;
      target.x -= fx;
      target.y -= fy;
    });

    // Keep in bounds
    nodes.forEach(node => {
      node.x = Math.max(30, Math.min(width - 30, node.x));
      node.y = Math.max(30, Math.min(height - 30, node.y));
    });
  }

  return network;
}
