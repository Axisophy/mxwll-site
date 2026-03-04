interface PlanetSVGProps {
  id: string
  size: number // pixel diameter of the planet body
}

export default function PlanetSVG({ id, size }: PlanetSVGProps) {
  switch (id) {
    case 'sun': return <SunSVG size={size} />
    case 'mercury': return <MercurySVG size={size} />
    case 'venus': return <VenusSVG size={size} />
    case 'earth': return <EarthSVG size={size} />
    case 'moon': return <MoonSVG size={size} />
    case 'mars': return <MarsSVG size={size} />
    case 'jupiter': return <JupiterSVG size={size} />
    case 'saturn': return <SaturnSVG size={size} />
    case 'uranus': return <UranusSVG size={size} />
    case 'neptune': return <NeptuneSVG size={size} />
    default: return null
  }
}

// ─── Sun ──────────────────────────────────────────────────────────────────────

function SunSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="sun-body">
          <stop offset="0%" stopColor="#FFF7E0" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="65%" stopColor="#FF9F00" />
          <stop offset="85%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#E04000" />
        </radialGradient>
        <radialGradient id="sun-glow">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
          <stop offset="70%" stopColor="#FFD700" stopOpacity="0" />
          <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.15" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="55" fill="url(#sun-glow)" />
      <circle cx="50" cy="50" r="50" fill="url(#sun-body)" />
      {/* Sunspots */}
      <circle cx="35" cy="42" r="2" fill="#CC5500" opacity="0.4" />
      <circle cx="58" cy="35" r="1.5" fill="#CC5500" opacity="0.35" />
      <circle cx="45" cy="55" r="2.5" fill="#CC5500" opacity="0.3" />
    </svg>
  )
}

// ─── Mercury ──────────────────────────────────────────────────────────────────

function MercurySVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="mercury-body" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#707070" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#mercury-body)" />
      {/* Craters */}
      <circle cx="35" cy="32" r="9" fill="#606060" opacity="0.35" />
      <circle cx="58" cy="54" r="11" fill="#606060" opacity="0.3" />
      <circle cx="42" cy="64" r="7" fill="#606060" opacity="0.25" />
      <circle cx="62" cy="32" r="5" fill="#606060" opacity="0.2" />
      <circle cx="30" cy="52" r="4" fill="#606060" opacity="0.2" />
    </svg>
  )
}

// ─── Venus ────────────────────────────────────────────────────────────────────

function VenusSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="venus-body" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFF5E0" />
          <stop offset="100%" stopColor="#D4A030" />
        </radialGradient>
        <clipPath id="venus-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#venus-body)" />
      {/* Atmospheric cloud bands */}
      <g clipPath="url(#venus-clip)" opacity="0.4">
        <ellipse cx="50" cy="28" rx="55" ry="5" fill="#F0D898" />
        <ellipse cx="50" cy="40" rx="50" ry="6" fill="#E8C878" />
        <ellipse cx="50" cy="55" rx="52" ry="5" fill="#F0D898" />
        <ellipse cx="50" cy="68" rx="48" ry="7" fill="#E8C878" />
        <ellipse cx="50" cy="80" rx="50" ry="4" fill="#F0D898" />
      </g>
    </svg>
  )
}

// ─── Earth ────────────────────────────────────────────────────────────────────

function EarthSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="earth-ocean" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#6CB4EE" />
          <stop offset="100%" stopColor="#1A5276" />
        </radialGradient>
        <clipPath id="earth-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#earth-ocean)" />
      {/* Continents - simplified blobs */}
      <g clipPath="url(#earth-clip)">
        {/* Europe/Africa */}
        <path d="M48 22 Q54 18 56 24 Q58 30 55 38 Q56 45 54 52 Q52 58 50 62 Q46 55 44 48 Q42 40 44 32 Q45 26 48 22Z" fill="#5B8C3E" opacity="0.85" />
        {/* Americas */}
        <path d="M28 26 Q32 22 35 28 Q36 34 34 40 Q30 44 28 50 Q26 56 28 62 Q30 68 32 72 Q28 70 26 64 Q22 56 22 48 Q22 38 25 30Z" fill="#5B8C3E" opacity="0.8" />
        {/* Asia */}
        <path d="M58 20 Q66 18 72 24 Q76 30 74 36 Q70 40 66 38 Q62 36 60 30 Q58 26 58 20Z" fill="#5B8C3E" opacity="0.75" />
        {/* Australia */}
        <path d="M68 58 Q74 56 76 60 Q78 64 74 68 Q70 66 68 62Z" fill="#8B7D3C" opacity="0.7" />
        {/* Polar caps */}
        <ellipse cx="50" cy="6" rx="30" ry="8" fill="white" opacity="0.7" />
        <ellipse cx="50" cy="95" rx="25" ry="7" fill="white" opacity="0.6" />
        {/* Clouds */}
        <ellipse cx="40" cy="35" rx="18" ry="3" fill="white" opacity="0.3" transform="rotate(-10 40 35)" />
        <ellipse cx="62" cy="50" rx="14" ry="2.5" fill="white" opacity="0.25" transform="rotate(5 62 50)" />
      </g>
    </svg>
  )
}

// ─── Moon ─────────────────────────────────────────────────────────────────────

function MoonSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="moon-body" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#E0DDD5" />
          <stop offset="100%" stopColor="#A09890" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#moon-body)" />
      {/* Maria (dark plains) */}
      <circle cx="38" cy="38" r="12" fill="#8A8580" opacity="0.3" />
      <circle cx="56" cy="30" r="8" fill="#8A8580" opacity="0.25" />
      <circle cx="48" cy="55" r="10" fill="#8A8580" opacity="0.2" />
      {/* Craters */}
      <circle cx="62" cy="52" r="6" fill="#908880" opacity="0.2" />
      <circle cx="35" cy="62" r="4" fill="#908880" opacity="0.15" />
    </svg>
  )
}

// ─── Mars ─────────────────────────────────────────────────────────────────────

function MarsSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="mars-body" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#E8734A" />
          <stop offset="100%" stopColor="#8B3A1A" />
        </radialGradient>
        <clipPath id="mars-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#mars-body)" />
      <g clipPath="url(#mars-clip)">
        {/* Darker regions (Syrtis Major etc) */}
        <path d="M42 35 Q50 30 58 38 Q54 48 46 44Z" fill="#6B2A10" opacity="0.3" />
        <ellipse cx="60" cy="55" rx="12" ry="8" fill="#6B2A10" opacity="0.2" />
        {/* Polar ice caps */}
        <ellipse cx="50" cy="5" rx="22" ry="8" fill="white" opacity="0.8" />
        <ellipse cx="50" cy="96" rx="18" ry="6" fill="white" opacity="0.6" />
      </g>
    </svg>
  )
}

// ─── Jupiter ──────────────────────────────────────────────────────────────────

function JupiterSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="jupiter-body" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#F5E0C0" />
          <stop offset="100%" stopColor="#C4956A" />
        </radialGradient>
        <clipPath id="jupiter-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#jupiter-body)" />
      {/* Bands */}
      <g clipPath="url(#jupiter-clip)">
        <rect x="0" y="12" width="100" height="6" fill="#D4A060" opacity="0.5" />
        <rect x="0" y="22" width="100" height="8" fill="#A06830" opacity="0.45" />
        <rect x="0" y="34" width="100" height="5" fill="#E8C898" opacity="0.4" />
        <rect x="0" y="43" width="100" height="7" fill="#B07840" opacity="0.5" />
        <rect x="0" y="54" width="100" height="6" fill="#E8C898" opacity="0.35" />
        <rect x="0" y="64" width="100" height="8" fill="#A06830" opacity="0.45" />
        <rect x="0" y="76" width="100" height="5" fill="#D4A060" opacity="0.4" />
        <rect x="0" y="85" width="100" height="7" fill="#B07840" opacity="0.35" />
        {/* Great Red Spot */}
        <ellipse cx="62" cy="58" rx="10" ry="7" fill="#CC5533" opacity="0.7" />
        <ellipse cx="62" cy="58" rx="7" ry="4.5" fill="#E07050" opacity="0.5" />
      </g>
    </svg>
  )
}

// ─── Saturn ───────────────────────────────────────────────────────────────────

function SaturnSVG({ size }: { size: number }) {
  // Saturn's rings extend to ~2.3x the body diameter horizontally
  const ringExtent = 2.3
  const totalWidth = size * ringExtent
  const totalHeight = size * 1.15

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox="0 0 230 115"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="saturn-body" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#F5E8C8" />
          <stop offset="100%" stopColor="#C4A458" />
        </radialGradient>
        <clipPath id="saturn-front">
          <rect x="0" y="57" width="230" height="58" />
        </clipPath>
        <clipPath id="saturn-planet">
          <circle cx="115" cy="57" r="44" />
        </clipPath>
      </defs>

      {/* Rings behind planet */}
      <g>
        {/* C ring (inner, faint) */}
        <ellipse cx="115" cy="57" rx="72" ry="16" fill="none" stroke="#C8B888" strokeWidth="5" opacity="0.3" />
        {/* B ring (bright) */}
        <ellipse cx="115" cy="57" rx="82" ry="18" fill="none" stroke="#D8C898" strokeWidth="8" opacity="0.5" />
        {/* Cassini division */}
        <ellipse cx="115" cy="57" rx="90" ry="20" fill="none" stroke="#F5EDE0" strokeWidth="2" opacity="0.6" />
        {/* A ring (outer) */}
        <ellipse cx="115" cy="57" rx="100" ry="22" fill="none" stroke="#C8B080" strokeWidth="7" opacity="0.4" />
        {/* F ring (outermost, thin) */}
        <ellipse cx="115" cy="57" rx="108" ry="24" fill="none" stroke="#B8A870" strokeWidth="1.5" opacity="0.3" />
      </g>

      {/* Planet body (covers middle of rings) */}
      <circle cx="115" cy="57" r="44" fill="url(#saturn-body)" />
      {/* Subtle bands */}
      <g clipPath="url(#saturn-planet)" opacity="0.35">
        <rect x="70" y="28" width="90" height="5" fill="#D4A858" />
        <rect x="70" y="38" width="90" height="7" fill="#C49848" />
        <rect x="70" y="50" width="90" height="4" fill="#D4A858" />
        <rect x="70" y="62" width="90" height="6" fill="#C49848" />
        <rect x="70" y="74" width="90" height="5" fill="#D4A858" />
      </g>

      {/* Rings in front of planet (bottom portion) */}
      <g clipPath="url(#saturn-front)">
        <ellipse cx="115" cy="57" rx="72" ry="16" fill="none" stroke="#C8B888" strokeWidth="5" opacity="0.3" />
        <ellipse cx="115" cy="57" rx="82" ry="18" fill="none" stroke="#D8C898" strokeWidth="8" opacity="0.5" />
        <ellipse cx="115" cy="57" rx="90" ry="20" fill="none" stroke="#F5EDE0" strokeWidth="2" opacity="0.6" />
        <ellipse cx="115" cy="57" rx="100" ry="22" fill="none" stroke="#C8B080" strokeWidth="7" opacity="0.4" />
        <ellipse cx="115" cy="57" rx="108" ry="24" fill="none" stroke="#B8A870" strokeWidth="1.5" opacity="0.3" />
      </g>
    </svg>
  )
}

// ─── Uranus ───────────────────────────────────────────────────────────────────

function UranusSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="uranus-body" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#D0F0F0" />
          <stop offset="100%" stopColor="#5CACAC" />
        </radialGradient>
        <clipPath id="uranus-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#uranus-body)" />
      {/* Very subtle banding */}
      <g clipPath="url(#uranus-clip)" opacity="0.2">
        <rect x="0" y="20" width="100" height="8" fill="#80C8C8" />
        <rect x="0" y="38" width="100" height="6" fill="#60B0B0" />
        <rect x="0" y="56" width="100" height="7" fill="#80C8C8" />
        <rect x="0" y="72" width="100" height="6" fill="#60B0B0" />
      </g>
      {/* Thin tilted ring (shown nearly vertical to represent 98° tilt) */}
      <ellipse
        cx="50" cy="50" rx="56" ry="4"
        fill="none" stroke="#A0D8D8" strokeWidth="1.5" opacity="0.4"
        transform="rotate(78 50 50)"
      />
    </svg>
  )
}

// ─── Neptune ──────────────────────────────────────────────────────────────────

function NeptuneSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="neptune-body" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#7BA3D4" />
          <stop offset="100%" stopColor="#1E3A6E" />
        </radialGradient>
        <clipPath id="neptune-clip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#neptune-body)" />
      {/* Atmospheric bands */}
      <g clipPath="url(#neptune-clip)" opacity="0.3">
        <rect x="0" y="25" width="100" height="6" fill="#2A4A80" />
        <rect x="0" y="42" width="100" height="8" fill="#1E3A6E" />
        <rect x="0" y="60" width="100" height="5" fill="#2A4A80" />
        <rect x="0" y="75" width="100" height="7" fill="#1E3A6E" />
      </g>
      {/* Great Dark Spot */}
      <ellipse cx="40" cy="45" rx="8" ry="6" fill="#15305A" opacity="0.5" />
    </svg>
  )
}
