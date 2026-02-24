# Neuronal Firing - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
Simulate activation propagation on a 3D neuron graph:
- Neurons as nodes
- Axons as edges
- Thresholded activation and refractory periods

Modes:
1. Spontaneous activity with background firing and occasional bursts.
2. Stimulus response where user triggers a cascade from chosen neuron.
3. Network comparison across random, small-world, and scale-free topologies.

## Visual language
- Neurons as spheres: dim at rest, bright on firing.
- Axons as lines with travelling light pulse.
- Inhibitory neurons tinted red, excitatory tinted blue-white.

## Explanation targets
- All-or-nothing action potential threshold behaviour.
- Refractory period limiting immediate re-fire.
- Small-world topology enabling efficient propagation.

## Implementation
- Three.js instanced spheres for neuron bodies.
- Custom shader effect for pulse travel on edges.
- Graph generator based on Watts-Strogatz small-world model.
- Target scale: roughly 1000-5000 neurons on desktop.

## Rejected approaches
- Instant edge activation with no travel time: rejected because it obscures propagation dynamics.
- Fully random static layout with no topology controls: rejected due to weak explanatory value.

## Data sources
- Procedural graph generation for baseline modes.
- Optional empirical connectome subsets as future extension.

## Visual design intent
Lively and legible. Signal propagation should be emotionally clear while preserving scientific framing.
