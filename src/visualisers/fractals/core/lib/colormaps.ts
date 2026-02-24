// Colormap definitions for fractal visualizations

export type ColorMap = (t: number) => [number, number, number];

// Interpolate between colors
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

// Create a colormap from a list of color stops
function createColorMap(
  colors: [number, number, number][]
): ColorMap {
  return (t: number) => {
    t = Math.max(0, Math.min(1, t));
    const n = colors.length - 1;
    const i = Math.min(Math.floor(t * n), n - 1);
    const f = t * n - i;
    return lerpColor(colors[i], colors[i + 1], f);
  };
}

// Inferno colormap (dark to yellow)
export const inferno: ColorMap = createColorMap([
  [0, 0, 4],
  [40, 11, 84],
  [101, 21, 110],
  [159, 42, 99],
  [212, 72, 66],
  [245, 125, 21],
  [250, 193, 39],
  [252, 255, 164],
]);

// Viridis colormap (purple to yellow-green)
export const viridis: ColorMap = createColorMap([
  [68, 1, 84],
  [72, 40, 120],
  [62, 74, 137],
  [49, 104, 142],
  [38, 130, 142],
  [31, 158, 137],
  [53, 183, 121],
  [109, 205, 89],
  [180, 222, 44],
  [253, 231, 37],
]);

// Hot colormap (black to white through red/yellow)
export const hot: ColorMap = createColorMap([
  [0, 0, 0],
  [128, 0, 0],
  [255, 0, 0],
  [255, 128, 0],
  [255, 255, 0],
  [255, 255, 128],
  [255, 255, 255],
]);

// Grayscale
export const grayscale: ColorMap = (t: number) => {
  const v = Math.round(t * 255);
  return [v, v, v];
};

// Electric (using Bang Industries blue)
export const electric: ColorMap = createColorMap([
  [0, 0, 0],
  [0, 20, 60],
  [0, 55, 150],
  [0, 85, 255],
  [100, 150, 255],
  [200, 220, 255],
  [255, 255, 255],
]);

// Sunset (pink to lime, using brand colors)
export const sunset: ColorMap = createColorMap([
  [0, 0, 0],
  [80, 0, 40],
  [255, 0, 85],
  [255, 100, 50],
  [255, 200, 0],
  [204, 255, 0],
  [255, 255, 200],
]);

export const COLORMAPS: Record<string, ColorMap> = {
  inferno,
  viridis,
  hot,
  grayscale,
  electric,
  sunset,
};

export const COLORMAP_NAMES = Object.keys(COLORMAPS);
