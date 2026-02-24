# Roche Limit - Specification
**Version:** 1.0
**Created:** 2026-02-24

## Brief
N-body style simulation where a moon is modelled as a gravitationally bound particle cluster orbiting a fixed planet attractor.

Narrative arc:
1. Stable orbit beyond Roche limit.
2. Inward orbital decay and tidal deformation.
3. Roche limit crossing and first particle escape.
4. Progressive disintegration and stream formation.
5. Ring system end state.

## Physics model
- Roche limit: `d = R_M * (2*rho_planet/rho_moon)^(1/3)`.
- Visualise critical radius as ring around planet.
- Tidal force modelled as gravity differential across moon diameter.
- Self-gravity binds particles until tidal differential dominates.

## Implementation approach
- GPGPU FBO simulation for particle updates.
- Particle budget target: 5,000 to 50,000 on desktop.
- Approximate self-gravity with Barnes-Hut-style acceleration strategy.

## Explanation target
Demonstrate why ring systems can form from disrupted moons, with Saturn used as context.

## Rejected approaches
- Rigid-body moon breakup trigger only: rejected because progressive deformation is explanatory.
- CPU all-pairs gravity: rejected for performance.

## Data sources
- Procedural simulation parameters.
- Optional planet/moon density presets from published values.

## Visual design intent
Start with a calm orbital system, then escalate into clear structural failure. Ring formation should feel inevitable and legible.
