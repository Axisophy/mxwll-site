import { Gate, Circuit, GateType } from './types';

export function evaluateGate(type: GateType, inputs: boolean[]): boolean {
  switch (type) {
    case 'AND':
      return inputs.every(i => i);
    case 'OR':
      return inputs.some(i => i);
    case 'NOT':
      return !inputs[0];
    case 'XOR':
      return inputs.reduce((a, b) => a !== b, false);
    case 'NAND':
      return !inputs.every(i => i);
    case 'NOR':
      return !inputs.some(i => i);
    case 'INPUT':
      return inputs[0] ?? false;
    case 'OUTPUT':
      return inputs[0] ?? false;
    default:
      return false;
  }
}

export function evaluateCircuit(circuit: Circuit, inputValues: boolean[]): Map<string, boolean> {
  const values = new Map<string, boolean>();

  // Set input values
  const inputGates = circuit.gates.filter(g => g.type === 'INPUT');
  inputGates.forEach((gate, i) => {
    values.set(gate.id, inputValues[i] ?? false);
  });

  // Topological evaluation (simplified - assumes acyclic)
  let changed = true;
  let iterations = 0;
  const maxIterations = 100;

  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;

    circuit.gates.forEach(gate => {
      if (gate.type === 'INPUT') return;

      // Get input values from connections
      const inputVals = gate.inputs.map(inputId => values.get(inputId) ?? false);

      // Only evaluate if we have all inputs
      if (inputVals.length >= getRequiredInputs(gate.type)) {
        const result = evaluateGate(gate.type, inputVals);
        if (values.get(gate.id) !== result) {
          values.set(gate.id, result);
          changed = true;
        }
      }
    });
  }

  return values;
}

export function getRequiredInputs(type: GateType): number {
  switch (type) {
    case 'NOT':
    case 'INPUT':
    case 'OUTPUT':
      return 1;
    default:
      return 2;
  }
}

export function generateTruthTable(circuit: Circuit): { inputs: boolean[][]; outputs: boolean[] } {
  const inputGates = circuit.gates.filter(g => g.type === 'INPUT');
  const outputGates = circuit.gates.filter(g => g.type === 'OUTPUT');
  const numInputs = inputGates.length;

  if (numInputs === 0 || outputGates.length === 0) {
    return { inputs: [], outputs: [] };
  }

  const rows = Math.pow(2, numInputs);
  const inputs: boolean[][] = [];
  const outputs: boolean[] = [];

  for (let i = 0; i < rows; i++) {
    const inputRow: boolean[] = [];
    for (let j = numInputs - 1; j >= 0; j--) {
      inputRow.push(Boolean((i >> j) & 1));
    }
    inputs.push(inputRow);

    const values = evaluateCircuit(circuit, inputRow);
    const output = outputGates.length > 0 ? values.get(outputGates[0].id) ?? false : false;
    outputs.push(output);
  }

  return { inputs, outputs };
}

// Pre-built circuits
export const PRESET_CIRCUITS: Record<string, Circuit> = {
  'and-gate': {
    gates: [
      { id: 'in1', type: 'INPUT', x: 50, y: 80, inputs: [] },
      { id: 'in2', type: 'INPUT', x: 50, y: 160, inputs: [] },
      { id: 'and1', type: 'AND', x: 200, y: 120, inputs: ['in1', 'in2'] },
      { id: 'out1', type: 'OUTPUT', x: 350, y: 120, inputs: ['and1'] },
    ],
    connections: [
      { from: 'in1', to: 'and1', toInput: 0 },
      { from: 'in2', to: 'and1', toInput: 1 },
      { from: 'and1', to: 'out1', toInput: 0 },
    ],
  },
  'xor-from-nand': {
    gates: [
      { id: 'in1', type: 'INPUT', x: 50, y: 80, inputs: [] },
      { id: 'in2', type: 'INPUT', x: 50, y: 200, inputs: [] },
      { id: 'nand1', type: 'NAND', x: 150, y: 140, inputs: ['in1', 'in2'] },
      { id: 'nand2', type: 'NAND', x: 250, y: 80, inputs: ['in1', 'nand1'] },
      { id: 'nand3', type: 'NAND', x: 250, y: 200, inputs: ['nand1', 'in2'] },
      { id: 'nand4', type: 'NAND', x: 350, y: 140, inputs: ['nand2', 'nand3'] },
      { id: 'out1', type: 'OUTPUT', x: 450, y: 140, inputs: ['nand4'] },
    ],
    connections: [
      { from: 'in1', to: 'nand1', toInput: 0 },
      { from: 'in2', to: 'nand1', toInput: 1 },
      { from: 'in1', to: 'nand2', toInput: 0 },
      { from: 'nand1', to: 'nand2', toInput: 1 },
      { from: 'nand1', to: 'nand3', toInput: 0 },
      { from: 'in2', to: 'nand3', toInput: 1 },
      { from: 'nand2', to: 'nand4', toInput: 0 },
      { from: 'nand3', to: 'nand4', toInput: 1 },
      { from: 'nand4', to: 'out1', toInput: 0 },
    ],
  },
  'half-adder': {
    gates: [
      { id: 'in1', type: 'INPUT', x: 50, y: 80, inputs: [] },
      { id: 'in2', type: 'INPUT', x: 50, y: 200, inputs: [] },
      { id: 'xor1', type: 'XOR', x: 200, y: 80, inputs: ['in1', 'in2'] },
      { id: 'and1', type: 'AND', x: 200, y: 200, inputs: ['in1', 'in2'] },
      { id: 'out-sum', type: 'OUTPUT', x: 350, y: 80, inputs: ['xor1'] },
      { id: 'out-carry', type: 'OUTPUT', x: 350, y: 200, inputs: ['and1'] },
    ],
    connections: [
      { from: 'in1', to: 'xor1', toInput: 0 },
      { from: 'in2', to: 'xor1', toInput: 1 },
      { from: 'in1', to: 'and1', toInput: 0 },
      { from: 'in2', to: 'and1', toInput: 1 },
      { from: 'xor1', to: 'out-sum', toInput: 0 },
      { from: 'and1', to: 'out-carry', toInput: 0 },
    ],
  },
};
