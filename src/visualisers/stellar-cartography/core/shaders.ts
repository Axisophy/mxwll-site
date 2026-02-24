export const vertexShaderSource = `#version 300 es
precision highp float;

in vec2 a_skyPos;
in vec2 a_hrPos;
in float a_temperature;
in float a_absMag;

uniform float u_transition;
uniform vec2 u_pan;
uniform float u_zoom;
uniform vec2 u_resolution;
uniform float u_pointScale;

out float v_temperature;
out float v_alpha;

void main() {
    // Interpolate position between sky and HR diagram
    vec2 pos = mix(a_skyPos, a_hrPos, u_transition);

    // Apply pan and zoom
    pos = (pos + u_pan) * u_zoom;

    // Aspect ratio correction
    float aspect = u_resolution.x / u_resolution.y;
    pos.x /= aspect;

    gl_Position = vec4(pos, 0.0, 1.0);

    // Point size: brighter stars bigger
    // abs_mag range roughly -5 to 17. Map to size range.
    // Brightest (abs_mag < 0): 7-8px, Sun-like (abs_mag ~5): 2-3px, Dimmest (abs_mag > 12): 1px
    float magNorm = clamp((a_absMag - (-5.0)) / 22.0, 0.0, 1.0);
    gl_PointSize = mix(8.0, 1.0, magNorm) * u_pointScale;

    v_temperature = a_temperature;

    // Slight fade for dimmer stars
    v_alpha = mix(1.0, 0.4, magNorm);
}
`;

export const fragmentShaderSource = `#version 300 es
precision highp float;

in float v_temperature;
in float v_alpha;

out vec4 fragColor;

// Convert star temperature to RGB (simplified blackbody)
vec3 temperatureToColor(float temp) {
    float t = clamp(temp, 2000.0, 40000.0);

    vec3 color;

    // Red channel
    if (t < 6600.0) {
        color.r = 1.0;
    } else {
        float x = (t - 6000.0) / 1000.0;
        color.r = clamp(1.43 * pow(x, -0.35), 0.0, 1.0);
    }

    // Green channel
    if (t < 6600.0) {
        float x = t / 1000.0;
        color.g = clamp(0.39 * log(x) - 0.63, 0.0, 1.0);
    } else {
        float x = (t - 6000.0) / 1000.0;
        color.g = clamp(1.13 * pow(x, -0.25), 0.0, 1.0);
    }

    // Blue channel
    if (t < 2000.0) {
        color.b = 0.0;
    } else if (t < 6600.0) {
        float x = t / 1000.0 - 2.0;
        color.b = clamp(0.54 * log(x) - 0.33, 0.0, 1.0);
    } else {
        color.b = 1.0;
    }

    return color;
}

void main() {
    // Circular point with soft edge
    vec2 coord = gl_PointCoord * 2.0 - 1.0;
    float dist = length(coord);
    if (dist > 1.0) discard;

    // Soft falloff for glow effect
    float alpha = v_alpha * (1.0 - smoothstep(0.0, 1.0, dist));

    // Boost alpha slightly in center for a bright core
    alpha += 0.3 * (1.0 - smoothstep(0.0, 0.3, dist));
    alpha = clamp(alpha, 0.0, 1.0);

    vec3 color = temperatureToColor(v_temperature);

    // Slight bloom: brighten the core
    color += vec3(0.2) * (1.0 - smoothstep(0.0, 0.2, dist));

    fragColor = vec4(color, alpha);
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
export function createProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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
