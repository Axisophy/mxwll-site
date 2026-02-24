export const vertexShaderSource = `#version 300 es
precision highp float;

// Position attributes for each view
in vec2 a_posOrbits;     // View 0: Orbital positions
in vec2 a_posGaps;       // View 1: Histogram by semi-major axis
in vec2 a_posFamilies;   // View 2: (a, e) scatter plot
in vec2 a_posDanger;     // View 3: NEO focus
in vec2 a_posDiscovery;  // View 4: Timeline

// Per-asteroid data
in float a_semiMajorAxis;
in float a_eccentricity;
in float a_magnitude;
in float a_orbitClass;
in float a_family;
in float a_discoveryYear;
in float a_perihelion;

// Transition uniforms
uniform int u_viewFrom;      // Source view (0-4)
uniform int u_viewTo;        // Target view (0-4)
uniform float u_transition;  // 0 = from, 1 = to

// Camera uniforms
uniform vec2 u_pan;
uniform float u_zoom;
uniform vec2 u_resolution;
uniform float u_pointScale;

// Animation uniforms
uniform float u_time;
uniform float u_orbitalSpeed;

// Discovery view filter
uniform float u_discoveryYear;  // Current year in discovery view (for filtering)

// Outputs to fragment shader
out float v_semiMajorAxis;
out float v_eccentricity;
out float v_orbitClass;
out float v_family;
out float v_perihelion;
out float v_alpha;

// Get position for a specific view
vec2 getViewPosition(int viewId) {
    if (viewId == 0) {
        // Orbital view with rotation
        float angularSpeed = pow(a_semiMajorAxis, -1.5) * u_orbitalSpeed * u_time;
        float cosR = cos(angularSpeed);
        float sinR = sin(angularSpeed);
        return vec2(
            a_posOrbits.x * cosR - a_posOrbits.y * sinR,
            a_posOrbits.x * sinR + a_posOrbits.y * cosR
        );
    } else if (viewId == 1) {
        return a_posGaps;
    } else if (viewId == 2) {
        return a_posFamilies;
    } else if (viewId == 3) {
        return a_posDanger;
    } else {
        return a_posDiscovery;
    }
}

void main() {
    // Get positions for from and to views
    vec2 fromPos = getViewPosition(u_viewFrom);
    vec2 toPos = getViewPosition(u_viewTo);

    // If transitioning from orbital view, fade out rotation
    if (u_viewFrom == 0 && u_transition > 0.0) {
        vec2 staticPos = a_posOrbits;
        fromPos = mix(fromPos, staticPos, u_transition);
    }
    // If transitioning to orbital view, fade in rotation
    if (u_viewTo == 0 && u_transition < 1.0) {
        vec2 staticPos = a_posOrbits;
        toPos = mix(staticPos, toPos, u_transition);
    }

    // Blend between views
    vec2 pos = mix(fromPos, toPos, u_transition);

    // Apply pan and zoom
    pos = (pos + u_pan) * u_zoom;

    // Aspect ratio correction
    float aspect = u_resolution.x / u_resolution.y;
    pos.x /= aspect;

    gl_Position = vec4(pos, 0.0, 1.0);

    // Point size: brighter asteroids slightly larger
    float magNorm = clamp((a_magnitude - 10.0) / 12.0, 0.0, 1.0);
    gl_PointSize = mix(3.0, 1.0, magNorm) * u_pointScale;

    // Pass data to fragment shader
    v_semiMajorAxis = a_semiMajorAxis;
    v_eccentricity = a_eccentricity;
    v_orbitClass = a_orbitClass;
    v_family = a_family;
    v_perihelion = a_perihelion;

    // Base alpha from magnitude
    v_alpha = mix(0.8, 0.3, magNorm);

    // Discovery view: fade based on discovery year filter
    if (u_viewTo == 4 || (u_viewFrom == 4 && u_transition < 1.0)) {
        float yearVisible = step(a_discoveryYear, u_discoveryYear);
        v_alpha *= yearVisible;
    }
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

in float v_semiMajorAxis;
in float v_eccentricity;
in float v_orbitClass;
in float v_family;
in float v_perihelion;
in float v_alpha;

uniform int u_viewTo;        // Current target view for coloring
uniform float u_transition;  // Transition progress

out vec4 fragColor;

// Color by semi-major axis (gradient from inner to outer belt)
vec3 getColorBySMA(float a) {
    float t = clamp((a - 1.5) / 4.0, 0.0, 1.0);
    vec3 inner = vec3(0.9, 0.6, 0.3);
    vec3 mid = vec3(0.7, 0.7, 0.6);
    vec3 outer = vec3(0.4, 0.5, 0.7);
    if (t < 0.5) {
        return mix(inner, mid, t * 2.0);
    } else {
        return mix(mid, outer, (t - 0.5) * 2.0);
    }
}

// Color by orbit class
vec3 getColorByClass(float orbitClass) {
    int c = int(orbitClass);
    if (c == 0) return vec3(0.7, 0.7, 0.65);      // MBA
    if (c == 1) return vec3(0.85, 0.75, 0.5);     // Hungaria
    if (c == 2) return vec3(0.8, 0.7, 0.6);       // Phocaea
    if (c == 3) return vec3(0.6, 0.7, 0.8);       // Hilda
    if (c == 4) return vec3(0.5, 0.6, 0.85);      // Trojan
    if (c == 5) return vec3(0.9, 0.4, 0.3);       // NEO
    if (c == 6) return vec3(0.95, 0.3, 0.25);     // Atira
    if (c == 7) return vec3(0.9, 0.35, 0.3);      // Aten
    if (c == 8) return vec3(0.85, 0.4, 0.35);     // Apollo
    if (c == 9) return vec3(0.8, 0.5, 0.4);       // Amor
    return vec3(0.6, 0.6, 0.6);
}

// Color by asteroid family
vec3 getColorByFamily(float family) {
    int f = int(family);
    if (f == 0) return vec3(0.5, 0.5, 0.5);       // No family - gray
    if (f == 1) return vec3(1.0, 0.7, 0.4);       // Flora - orange
    if (f == 2) return vec3(0.78, 0.4, 1.0);      // Vesta - purple
    if (f == 3) return vec3(0.4, 0.78, 0.6);      // Nysa - teal
    if (f == 4) return vec3(1.0, 0.86, 0.4);      // Eunomia - gold
    if (f == 5) return vec3(0.6, 1.0, 0.6);       // Gefion - light green
    if (f == 6) return vec3(0.4, 0.7, 1.0);       // Koronis - light blue
    if (f == 7) return vec3(1.0, 0.6, 0.7);       // Eos - pink
    if (f == 8) return vec3(0.3, 0.4, 0.7);       // Themis - dark blue
    if (f == 9) return vec3(0.47, 0.3, 0.63);     // Hygiea - dark purple
    return vec3(0.5, 0.5, 0.5);
}

// Color for danger view (perihelion-based)
vec3 getColorByDanger(float perihelion, float orbitClass) {
    // Non-NEOs are dimmed
    int c = int(orbitClass);
    bool isNEO = c >= 5 && c <= 9;

    if (!isNEO) {
        return vec3(0.3, 0.3, 0.35);  // Dim gray for safe asteroids
    }

    // NEOs colored by perihelion distance
    // Closer = more red, further = more orange
    float danger = 1.0 - clamp(perihelion / 1.3, 0.0, 1.0);
    vec3 safeColor = vec3(0.9, 0.6, 0.3);    // Orange
    vec3 dangerColor = vec3(1.0, 0.2, 0.1);  // Bright red
    return mix(safeColor, dangerColor, danger);
}

void main() {
    // Circular point with soft edge
    vec2 coord = gl_PointCoord * 2.0 - 1.0;
    float dist = length(coord);
    if (dist > 1.0) discard;

    // Soft falloff for glow effect
    float alpha = v_alpha * (1.0 - smoothstep(0.0, 1.0, dist));
    alpha += 0.2 * (1.0 - smoothstep(0.0, 0.3, dist));
    alpha = clamp(alpha, 0.0, 1.0);

    // Get color based on target view
    vec3 color;

    if (u_viewTo == 2) {
        // Family view - color by family
        color = getColorByFamily(v_family);
    } else if (u_viewTo == 3) {
        // Danger view - color by perihelion/NEO status
        color = getColorByDanger(v_perihelion, v_orbitClass);
    } else {
        // Default: blend SMA and class colors
        vec3 smaColor = getColorBySMA(v_semiMajorAxis);
        vec3 classColor = getColorByClass(v_orbitClass);
        color = mix(smaColor, classColor, 0.3);
    }

    // Slight bloom in center
    color += vec3(0.15) * (1.0 - smoothstep(0.0, 0.2, dist));

    fragColor = vec4(color, alpha);
}
`;

// Orbit circle shader for drawing planetary orbits
export const orbitVertexShaderSource = `#version 300 es
precision highp float;

in vec2 a_position;

uniform vec2 u_pan;
uniform float u_zoom;
uniform vec2 u_resolution;

void main() {
    vec2 pos = (a_position + u_pan) * u_zoom;
    float aspect = u_resolution.x / u_resolution.y;
    pos.x /= aspect;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`;

export const orbitFragmentShaderSource = `#version 300 es
precision highp float;

uniform vec4 u_color;

out vec4 fragColor;

void main() {
    fragColor = u_color;
}
`;

/**
 * Compile a shader from source
 */
export function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Create and link a shader program
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/**
 * Generate circle vertices for orbit rendering
 */
export function generateCircleVertices(radius: number, segments: number = 128): Float32Array {
  const vertices = new Float32Array(segments * 2);
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices[i * 2] = Math.cos(angle) * radius;
    vertices[i * 2 + 1] = Math.sin(angle) * radius;
  }
  return vertices;
}
