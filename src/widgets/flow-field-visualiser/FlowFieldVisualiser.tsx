'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Simplex Noise (self-contained) ────────
const F3 = 1/3, G3 = 1/6;
const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
];

class SimplexNoise {
  perm: Uint8Array;
  permMod12: Uint8Array;

  constructor(seed = 42) {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed * 2147483647;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise3D(xin: number, yin: number, zin: number): number {
    const { perm, permMod12 } = this;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=1;k2=0; }
      else if (x0 >= z0) { i1=1;j1=0;k1=0;i2=1;j2=0;k2=1; }
      else { i1=0;j1=0;k1=1;i2=1;j2=0;k2=1; }
    } else {
      if (y0 < z0) { i1=0;j1=0;k1=1;i2=0;j2=1;k2=1; }
      else if (x0 < z0) { i1=0;j1=1;k1=0;i2=0;j2=1;k2=1; }
      else { i1=0;j1=1;k1=0;i2=1;j2=1;k2=0; }
    }

    const x1=x0-i1+G3, y1=y0-j1+G3, z1=z0-k1+G3;
    const x2=x0-i2+2*G3, y2=y0-j2+2*G3, z2=z0-k2+2*G3;
    const x3=x0-1+3*G3, y3=y0-1+3*G3, z3=z0-1+3*G3;

    const ii=i&255, jj=j&255, kk=k&255;

    let n0=0,n1=0,n2=0,n3=0;
    let t0=0.6-x0*x0-y0*y0-z0*z0;
    if(t0>0){t0*=t0;const g=grad3[permMod12[ii+perm[jj+perm[kk]]]];n0=t0*t0*(g[0]*x0+g[1]*y0+g[2]*z0);}
    let t1=0.6-x1*x1-y1*y1-z1*z1;
    if(t1>0){t1*=t1;const g=grad3[permMod12[ii+i1+perm[jj+j1+perm[kk+k1]]]];n1=t1*t1*(g[0]*x1+g[1]*y1+g[2]*z1);}
    let t2=0.6-x2*x2-y2*y2-z2*z2;
    if(t2>0){t2*=t2;const g=grad3[permMod12[ii+i2+perm[jj+j2+perm[kk+k2]]]];n2=t2*t2*(g[0]*x2+g[1]*y2+g[2]*z2);}
    let t3=0.6-x3*x3-y3*y3-z3*z3;
    if(t3>0){t3*=t3;const g=grad3[permMod12[ii+1+perm[jj+1+perm[kk+1]]]];n3=t3*t3*(g[0]*x3+g[1]*y3+g[2]*z3);}

    return 32 * (n0+n1+n2+n3);
  }
}

// ─── OKLCh Colour ──────────────────────────
function oklchToRGB(L: number, C: number, H: number): [number, number, number] {
  const h = H * Math.PI / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_*l_*l_, m = m_*m_*m_, s = s_*s_*s_;
  const r = +4.0767416621*l - 3.3077115913*m + 0.2309699292*s;
  const g = -1.2684380046*l + 2.6097574011*m - 0.3413193965*s;
  const b2 = -0.0041960863*l - 0.7034186147*m + 1.7076147010*s;
  const gamma = (v: number) => v <= 0.0031308 ? 12.92*v : 1.055*Math.pow(Math.max(v,0.0001),1/2.4)-0.055;
  return [
    Math.round(Math.max(0, Math.min(1, gamma(r))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(g))) * 255),
    Math.round(Math.max(0, Math.min(1, gamma(b2))) * 255)
  ];
}

// ─── Palettes ──────────────────────────────
interface PaletteConfig {
  L: [number, number];
  C: [number, number];
  H: [number, number];
  label: string;
}

const PALETTES: Record<string, PaletteConfig> = {
  ember:      { L:[0.25,0.85], C:[0.05,0.18], H:[30,60],   label:'Ember' },
  deep_ocean: { L:[0.15,0.75], C:[0.04,0.15], H:[250,210], label:'Ocean' },
  electric:   { L:[0.30,0.70], C:[0.15,0.20], H:[330,290], label:'Electric' },
  bone:       { L:[0.20,0.90], C:[0.02,0.08], H:[60,80],   label:'Bone' },
  thermal:    { L:[0.15,0.55], C:[0.01,0.20], H:[270,390], label:'Thermal' },
};

function buildLUT(paletteName: string, steps = 256): [number, number, number][] {
  const p = PALETTES[paletteName];
  const lut: [number, number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    let H = p.H[0] + (p.H[1] - p.H[0]) * t;
    if (H >= 360) H -= 360;
    lut.push(oklchToRGB(
      p.L[0] + (p.L[1] - p.L[0]) * t,
      p.C[0] + (p.C[1] - p.C[0]) * t,
      H
    ));
  }
  return lut;
}

// ─── Types ─────────────────────────────────
interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  age: number;
  speedVar: number;
}

interface Params {
  scale: number;
  count: number;
  speed: number;
  fade: number;
  mouseRadius: number;
}

interface StateRef {
  setLUT: (name: string) => void;
  reset: () => void;
  save: () => void;
}

// ─── Component ─────────────────────────────
export default function FlowFieldVisualiser() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<StateRef | null>(null);

  const [controlsVisible, setControlsVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [currentPalette, setCurrentPalette] = useState('thermal');
  const [stats, setStats] = useState({ particles: 0, fps: 0, frame: 0 });
  const [params, setParams] = useState<Params>({
    scale: 0.003,
    count: 8000,
    speed: 2.0,
    fade: 0.012,
    mouseRadius: 150,
  });

  const paramsRef = useRef(params);
  paramsRef.current = params;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const paletteRef = useRef('thermal');

  // Init and run simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const noise = new SimplexNoise(42);
    let lut = buildLUT('thermal');
    paletteRef.current = 'thermal';

    let W = 0, H = 0;
    let particles: Particle[] = [];
    let zOffset = 0;
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsSmooth = 60;
    let mouseX = -9999, mouseY = -9999;
    let mouseActive = false;

    function createParticle(): Particle {
      return { x: Math.random() * W, y: Math.random() * H, px: 0, py: 0, age: Math.random(), speedVar: 0.8 + Math.random() * 0.4 };
    }

    function initParticles(count: number) {
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = createParticle();
        p.px = p.x; p.py = p.y;
        particles.push(p);
      }
    }

    function fbm(x: number, y: number, z: number): number {
      let val = 0, amp = 1, freq = 1;
      for (let i = 0; i < 4; i++) {
        val += amp * noise.noise3D(x * freq, y * freq, z * freq);
        amp *= 0.5; freq *= 2;
      }
      return val;
    }

    function curlNoise(x: number, y: number, z: number, scale: number): [number, number] {
      const sx = x * scale, sy = y * scale;
      const eps = 0.5 * scale;
      const dn_dy = (fbm(sx, sy + eps, z) - fbm(sx, sy - eps, z)) / (2 * eps);
      const dn_dx = (fbm(sx + eps, sy, z) - fbm(sx - eps, sy, z)) / (2 * eps);
      return [-dn_dy, dn_dx];
    }

    function handleResize() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      W = Math.floor(rect.width);
      H = Math.floor(rect.height);
      canvas.width = W;
      canvas.height = H;
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(0, 0, W, H);
      initParticles(paramsRef.current.count);
    }

    // Expose methods for external control
    stateRef.current = {
      setLUT: (name: string) => { lut = buildLUT(name); paletteRef.current = name; },
      reset: () => {
        ctx.fillStyle = '#0a0808';
        ctx.fillRect(0, 0, W, H);
        initParticles(paramsRef.current.count);
        zOffset = 0; frameCount = 0;
      },
      save: () => {
        const link = document.createElement('a');
        link.download = `flow_field_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      },
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    // Mouse/touch
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top; mouseActive = true;
    };
    const onMouseLeave = () => { mouseActive = false; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouseX = e.touches[0].clientX - rect.left; mouseY = e.touches[0].clientY - rect.top; mouseActive = true;
    };
    const onTouchEnd = () => { mouseActive = false; };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    // Animation loop
    function frame(now: number) {
      animRef.current = requestAnimationFrame(frame);
      if (!ctx || pausedRef.current || W === 0) return;

      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      fpsSmooth += (1000 / Math.max(dt, 1) - fpsSmooth) * 0.1;

      const p = paramsRef.current;

      ctx.fillStyle = `rgba(10, 8, 8, ${p.fade})`;
      ctx.fillRect(0, 0, W, H);
      zOffset += 0.003;

      // Adjust particle count
      while (particles.length < p.count) particles.push(createParticle());
      if (particles.length > p.count) particles.length = p.count;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.px = pt.x; pt.py = pt.y;

        let [vx, vy] = curlNoise(pt.x, pt.y, zOffset, p.scale);

        if (mouseActive) {
          const dx = pt.x - mouseX, dy = pt.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.exp(-dist * dist / (p.mouseRadius * p.mouseRadius));
          vx += (mouseX - pt.x) * influence * 0.015;
          vy += (mouseY - pt.y) * influence * 0.015;
        }

        pt.x += vx * p.speed * pt.speedVar;
        pt.y += vy * p.speed * pt.speedVar;
        pt.age = Math.min(pt.age + 0.02, 1.0);

        if (pt.x < -10 || pt.x > W + 10 || pt.y < -10 || pt.y > H + 10) {
          pt.x = Math.random() * W; pt.y = Math.random() * H;
          pt.px = pt.x; pt.py = pt.y; pt.age = 0;
          continue;
        }

        const speed = Math.sqrt((pt.x - pt.px) ** 2 + (pt.y - pt.py) ** 2);
        const speedNorm = Math.min(speed / (p.speed * 4), 1);
        const ci = Math.min(Math.floor(speedNorm * 255), 255);
        const [r, g, b] = lut[ci];
        const alpha = (0.02 + 0.12 * speedNorm) * pt.age;

        // Glow
        ctx.beginPath();
        ctx.moveTo(pt.px, pt.py);
        ctx.lineTo(pt.x, pt.y);
        ctx.lineWidth = 3;
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.3})`;
        ctx.stroke();

        // Core
        ctx.lineWidth = Math.max(0.3, 1.5 - speedNorm * 1.2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.stroke();
      }

      frameCount++;
      if (frameCount % 15 === 0) {
        setStats({ particles: particles.length, fps: Math.round(fpsSmooth), frame: frameCount });
      }
    }

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'h') setControlsVisible(v => !v);
      else if (key === 'r') stateRef.current?.reset();
      else if (key === 's') stateRef.current?.save();
      else if (key === ' ') { e.preventDefault(); setPaused(v => !v); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handlePaletteChange = useCallback((key: string) => {
    setCurrentPalette(key);
    stateRef.current?.setLUT(key);
  }, []);

  const handleParamChange = useCallback((key: keyof Params, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  // Reusable controls panel content
  const ControlsContent = () => (
    <>
      <h2 className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/40 mb-4">
        Curl Flow Fields
      </h2>

      {/* Scale */}
      <div className="flex justify-between items-baseline mb-0.5">
        <span className="text-[9px] font-medium tracking-[0.08em] uppercase text-white/65">Scale</span>
        <span className="text-[10px] tabular-nums text-white/45 font-mono">{params.scale}</span>
      </div>
      <input type="range" className="w-full mb-3" min={0.001} max={0.01} step={0.0005} value={params.scale}
        onChange={e => handleParamChange('scale', parseFloat(e.target.value))}
        style={{ height: '1px', accentColor: 'rgba(255,255,255,0.55)' }} />

      {/* Particles */}
      <div className="flex justify-between items-baseline mb-0.5">
        <span className="text-[9px] font-medium tracking-[0.08em] uppercase text-white/65">Particles</span>
        <span className="text-[10px] tabular-nums text-white/45 font-mono">{params.count}</span>
      </div>
      <input type="range" className="w-full mb-3" min={1000} max={20000} step={500} value={params.count}
        onChange={e => handleParamChange('count', parseInt(e.target.value))} />

      {/* Speed */}
      <div className="flex justify-between items-baseline mb-0.5">
        <span className="text-[9px] font-medium tracking-[0.08em] uppercase text-white/65">Speed</span>
        <span className="text-[10px] tabular-nums text-white/45 font-mono">{params.speed.toFixed(1)}</span>
      </div>
      <input type="range" className="w-full mb-3" min={0.5} max={5} step={0.1} value={params.speed}
        onChange={e => handleParamChange('speed', parseFloat(e.target.value))} />

      {/* Fade */}
      <div className="flex justify-between items-baseline mb-0.5">
        <span className="text-[9px] font-medium tracking-[0.08em] uppercase text-white/65">Trail Fade</span>
        <span className="text-[10px] tabular-nums text-white/45 font-mono">{params.fade}</span>
      </div>
      <input type="range" className="w-full mb-3" min={0.002} max={0.05} step={0.001} value={params.fade}
        onChange={e => handleParamChange('fade', parseFloat(e.target.value))} />

      {/* Palettes */}
      <div className="text-[8px] font-medium tracking-[0.1em] uppercase text-white/25 mt-3 mb-1.5">Palette</div>
      <div className="flex flex-wrap gap-1 mb-3">
        {Object.entries(PALETTES).map(([key, val]) => (
          <button key={key}
            className={`px-2.5 py-1 text-[8px] font-medium tracking-[0.08em] uppercase border rounded-sm transition-all duration-200 cursor-pointer
              ${currentPalette === key
                ? 'border-[#f72585] text-[#f72585]'
                : 'border-white/10 text-white/45 hover:border-white/25 hover:text-white/75'
              }`}
            style={{ background: 'transparent', fontFamily: 'inherit' }}
            onClick={() => handlePaletteChange(key)}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 p-2 rounded-sm font-mono text-[9px] leading-relaxed text-white/30"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        particles: {stats.particles.toLocaleString()}<br />
        fps: {stats.fps}<br />
        frame: {stats.frame.toLocaleString()}
      </div>

      {/* Keyboard hints */}
      <div className="flex flex-wrap gap-2 mt-2.5">
        {[['H','hide'],['R','reset'],['S','save'],['␣','pause']].map(([k, label]) => (
          <span key={k} className="text-[9px] text-white/30 flex items-center gap-1">
            <code className="px-1 py-px border border-white/10 rounded-sm font-mono text-[9px] text-white/35">{k}</code>
            {label}
          </span>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex flex-col">
      {/* Canvas container */}
      <div ref={containerRef} className="relative w-full aspect-video bg-[#0a0808] cursor-crosshair overflow-hidden">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Desktop controls - floating overlay (hidden on mobile) */}
        <div
          className={`hidden lg:block absolute top-4 right-4 w-[220px] p-4 rounded-md transition-all duration-300 z-10
            ${controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-2'}`}
          style={{
            background: 'rgba(8, 8, 10, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <ControlsContent />
        </div>
      </div>

      {/* Mobile controls - below canvas (hidden on desktop) */}
      <div
        className="lg:hidden p-4 bg-[#0a0808]"
        style={{
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderTop: 'none',
        }}
      >
        <ControlsContent />
      </div>
    </div>
  );
}
