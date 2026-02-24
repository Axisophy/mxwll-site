import { Point2D, ModelType } from './types';

export interface ClassifierResult {
  predict: (x: number, y: number) => number;  // Returns probability 0-1
  accuracy: number;
}

// Simple linear classifier (perceptron-style)
export function trainLinear(points: Point2D[], regularization: number = 0.01): ClassifierResult {
  // Gradient descent for logistic regression
  let w0 = 0, w1 = 0, w2 = 0;  // bias, x weight, y weight
  const lr = 0.1;
  const iterations = 1000;

  for (let iter = 0; iter < iterations; iter++) {
    let dw0 = 0, dw1 = 0, dw2 = 0;

    points.forEach(p => {
      const z = w0 + w1 * p.x + w2 * p.y;
      const pred = 1 / (1 + Math.exp(-z));
      const err = pred - p.label;
      dw0 += err;
      dw1 += err * p.x;
      dw2 += err * p.y;
    });

    w0 -= lr * (dw0 / points.length + regularization * w0);
    w1 -= lr * (dw1 / points.length + regularization * w1);
    w2 -= lr * (dw2 / points.length + regularization * w2);
  }

  const predict = (x: number, y: number) => {
    const z = w0 + w1 * x + w2 * y;
    return 1 / (1 + Math.exp(-z));
  };

  const accuracy = points.filter(p =>
    (predict(p.x, p.y) > 0.5 ? 1 : 0) === p.label
  ).length / points.length;

  return { predict, accuracy };
}

// Polynomial features (degree 2)
export function trainPolynomial(points: Point2D[], regularization: number = 0.01): ClassifierResult {
  // Features: 1, x, y, x², xy, y²
  let w = [0, 0, 0, 0, 0, 0];
  const lr = 0.05;
  const iterations = 2000;

  const features = (x: number, y: number) => [1, x, y, x*x, x*y, y*y];

  for (let iter = 0; iter < iterations; iter++) {
    const dw = [0, 0, 0, 0, 0, 0];

    points.forEach(p => {
      const f = features(p.x, p.y);
      const z = f.reduce((sum, fi, i) => sum + fi * w[i], 0);
      const pred = 1 / (1 + Math.exp(-z));
      const err = pred - p.label;
      f.forEach((fi, i) => dw[i] += err * fi);
    });

    w = w.map((wi, i) => wi - lr * (dw[i] / points.length + regularization * wi));
  }

  const predict = (x: number, y: number) => {
    const f = features(x, y);
    const z = f.reduce((sum, fi, i) => sum + fi * w[i], 0);
    return 1 / (1 + Math.exp(-z));
  };

  const accuracy = points.filter(p =>
    (predict(p.x, p.y) > 0.5 ? 1 : 0) === p.label
  ).length / points.length;

  return { predict, accuracy };
}

// k-Nearest Neighbors
export function trainKNN(points: Point2D[], k: number = 5): ClassifierResult {
  const predict = (x: number, y: number) => {
    const distances = points.map(p => ({
      dist: Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2),
      label: p.label,
    }));

    distances.sort((a, b) => a.dist - b.dist);
    const neighbors = distances.slice(0, k);
    const sum = neighbors.reduce((s, n) => s + n.label, 0);
    return sum / k;
  };

  const accuracy = points.filter(p =>
    (predict(p.x, p.y) > 0.5 ? 1 : 0) === p.label
  ).length / points.length;

  return { predict, accuracy };
}

// RBF Kernel (simplified - using weighted average)
export function trainRBF(points: Point2D[], gamma: number = 1): ClassifierResult {
  const predict = (x: number, y: number) => {
    let weightedSum = 0;
    let totalWeight = 0;

    points.forEach(p => {
      const dist = (p.x - x) ** 2 + (p.y - y) ** 2;
      const weight = Math.exp(-gamma * dist);
      weightedSum += weight * p.label;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
  };

  const accuracy = points.filter(p =>
    (predict(p.x, p.y) > 0.5 ? 1 : 0) === p.label
  ).length / points.length;

  return { predict, accuracy };
}

// Generate sample datasets
export function generateDataset(type: 'linear' | 'circular' | 'xor' | 'moons', n: number = 100): Point2D[] {
  const points: Point2D[] = [];

  switch (type) {
    case 'linear':
      for (let i = 0; i < n; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const label = (x + y + (Math.random() - 0.5) * 0.3 > 0) ? 1 : 0;
        points.push({ x, y, label });
      }
      break;

    case 'circular':
      for (let i = 0; i < n; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.5 + (i < n/2 ? 0 : 0.7);
        const x = Math.cos(angle) * r + (Math.random() - 0.5) * 0.1;
        const y = Math.sin(angle) * r + (Math.random() - 0.5) * 0.1;
        const label = i < n/2 ? 0 : 1;
        points.push({ x: x * 0.8, y: y * 0.8, label });
      }
      break;

    case 'xor':
      for (let i = 0; i < n; i++) {
        const x = Math.random() * 2 - 1;
        const y = Math.random() * 2 - 1;
        const label = ((x > 0) !== (y > 0)) ? 1 : 0;
        points.push({
          x: x + (Math.random() - 0.5) * 0.2,
          y: y + (Math.random() - 0.5) * 0.2,
          label
        });
      }
      break;

    case 'moons':
      for (let i = 0; i < n; i++) {
        const isTop = i < n / 2;
        const angle = (i / (n/2)) * Math.PI;
        const x = isTop ? Math.cos(angle) : Math.cos(angle) + 0.5;
        const y = isTop ? Math.sin(angle) : -Math.sin(angle) + 0.3;
        points.push({
          x: x * 0.6 - 0.3 + (Math.random() - 0.5) * 0.15,
          y: y * 0.6 + (Math.random() - 0.5) * 0.15,
          label: isTop ? 0 : 1,
        });
      }
      break;
  }

  return points;
}
