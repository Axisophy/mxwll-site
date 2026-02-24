'use client';

import React from 'react';
import { EARTH, MOON, hohmannTransfer, formatTime, formatVelocity } from '../lib/physics';

export function MissionMap() {
  // Earth-Moon transfer (simplified - LEO to Moon&apos;s orbit)
  const LEO_ALTITUDE = 400;  // km
  const r1 = EARTH.radius + LEO_ALTITUDE;
  const r2 = MOON.orbitRadius!;

  const transfer = hohmannTransfer(r1, r2, EARTH.mu);

  // Scale for visualization (Moon&apos;s orbit = 300px radius)
  const scale = 300 / r2;
  const width = 700;
  const height = 700;
  const cx = width / 2;
  const cy = height / 2;

  // Scaled values
  const earthR = Math.max(EARTH.radius * scale, 15);
  const moonOrbitR = r2 * scale;
  const leoR = r1 * scale;
  const transferA = transfer.transferOrbit.semiMajorAxis * scale;
  const transferE = transfer.transferOrbit.eccentricity;

  // Transfer ellipse parameters
  const transferApoapsis = transfer.transferOrbit.apoapsis * scale;
  const transferB = transferA * Math.sqrt(1 - transferE * transferE);
  const transferCx = cx + (transferApoapsis - transferA);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Background */}
        <rect width={width} height={height} fill="#0a0a0a" />

        {/* Moon&apos;s orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={moonOrbitR}
          fill="none"
          stroke="#333"
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* LEO orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={leoR}
          fill="none"
          stroke="#4A90D9"
          strokeWidth={1.5}
        />

        {/* Transfer ellipse */}
        <ellipse
          cx={transferCx}
          cy={cy}
          rx={transferA}
          ry={transferB}
          fill="none"
          stroke="#FF6B35"
          strokeWidth={2}
          strokeDasharray="8,4"
          transform={`rotate(180, ${cx}, ${cy})`}
        />

        {/* Earth */}
        <circle cx={cx} cy={cy} r={earthR} fill="#4A90D9" />
        <text x={cx} y={cy + earthR + 20} textAnchor="middle" fill="#fff" fontSize="12" fontFamily="monospace">
          Earth
        </text>

        {/* Moon (at apoapsis of transfer) */}
        <circle cx={cx - moonOrbitR} cy={cy} r={8} fill="#C4C4C4" />
        <text x={cx - moonOrbitR} y={cy + 25} textAnchor="middle" fill="#fff" fontSize="12" fontFamily="monospace">
          Moon
        </text>

        {/* TLI burn marker */}
        <g transform={`translate(${cx + leoR}, ${cy})`}>
          <circle r={6} fill="#FF6B35" />
          <line x1={10} y1={0} x2={30} y2={0} stroke="#FF6B35" strokeWidth={2} />
          <polygon points="30,-5 40,0 30,5" fill="#FF6B35" />
        </g>

        {/* LOI burn marker */}
        <g transform={`translate(${cx - moonOrbitR + 15}, ${cy})`}>
          <circle r={6} fill="#00D4AA" />
          <line x1={-10} y1={0} x2={-30} y2={0} stroke="#00D4AA" strokeWidth={2} />
          <polygon points="-30,-5 -40,0 -30,5" fill="#00D4AA" />
        </g>

        {/* Time markers along transfer */}
        {[0.25, 0.5, 0.75].map((frac, i) => {
          const angle = Math.PI * frac;
          const r = transferA * (1 - transferE * transferE) / (1 + transferE * Math.cos(angle));
          const x = cx - r * Math.cos(angle);
          const y = cy - r * Math.sin(angle);
          const time = formatTime(transfer.transferTime * frac);

          return (
            <g key={i}>
              <circle cx={x} cy={y} r={3} fill="#666" />
              <text x={x + 10} y={y - 10} fill="#888" fontSize="10" fontFamily="monospace">
                T+{time}
              </text>
            </g>
          );
        })}

        {/* Legend / Info boxes */}
        <g transform="translate(20, 20)">
          <rect width={180} height={100} fill="#1a1a1a" />
          <text x={10} y={25} fill="#FF6B35" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Trans-Lunar Injection
          </text>
          <text x={10} y={45} fill="#aaa" fontSize="10" fontFamily="monospace">
            {'\u0394'}v = {formatVelocity(transfer.deltaV1)}
          </text>
          <text x={10} y={60} fill="#888" fontSize="9" fontFamily="monospace">
            Burn at periapsis for max
          </text>
          <text x={10} y={73} fill="#888" fontSize="9" fontFamily="monospace">
            efficiency (Oberth effect)
          </text>
        </g>

        <g transform={`translate(${width - 200}, 20)`}>
          <rect width={180} height={100} fill="#1a1a1a" />
          <text x={10} y={25} fill="#00D4AA" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Lunar Orbit Insertion
          </text>
          <text x={10} y={45} fill="#aaa" fontSize="10" fontFamily="monospace">
            {'\u0394'}v = {formatVelocity(transfer.deltaV2)}
          </text>
          <text x={10} y={60} fill="#888" fontSize="9" fontFamily="monospace">
            Retrograde burn to slow
          </text>
          <text x={10} y={73} fill="#888" fontSize="9" fontFamily="monospace">
            down and enter orbit
          </text>
        </g>

        <g transform={`translate(20, ${height - 80})`}>
          <rect width={200} height={60} fill="#1a1a1a" />
          <text x={10} y={20} fill="#fff" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Total {'\u0394'}v: {formatVelocity(transfer.totalDeltaV)}
          </text>
          <text x={10} y={40} fill="#888" fontSize="10" fontFamily="monospace">
            Transfer time: {formatTime(transfer.transferTime)}
          </text>
        </g>
      </svg>

      <p className="text-xs text-black/50 mt-4">
        Schematic not to scale. The Moon orbits at 384,400 km; Earth&apos;s radius is 6,371 km.
        A true-scale diagram would show Earth as a barely visible dot.
      </p>
    </div>
  );
}
