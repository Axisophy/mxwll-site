import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// 2D canvas methods used by charts/visual components in jsdom tests.
const mock2dContext = {
  canvas: null,
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
}

// WebGL methods/constants stub so getContext('webgl'/'webgl2') is available.
const mockWebGLContext = {
  ARRAY_BUFFER: 0x8892,
  STATIC_DRAW: 0x88e4,
  TRIANGLES: 0x0004,
  FLOAT: 0x1406,
  COLOR_BUFFER_BIT: 0x4000,
  DEPTH_BUFFER_BIT: 0x0100,
  VERTEX_SHADER: 0x8b31,
  FRAGMENT_SHADER: 0x8b30,
  COMPILE_STATUS: 0x8b81,
  LINK_STATUS: 0x8b82,
  TEXTURE_2D: 0x0de1,
  RGBA: 0x1908,
  UNSIGNED_BYTE: 0x1401,
  FRAMEBUFFER: 0x8d40,
  FRAMEBUFFER_COMPLETE: 0x8cd5,
  createBuffer: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  createShader: vi.fn(),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn(() => true),
  getShaderInfoLog: vi.fn(() => ''),
  createProgram: vi.fn(),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  getProgramInfoLog: vi.fn(() => ''),
  useProgram: vi.fn(),
  getAttribLocation: vi.fn(() => 0),
  vertexAttribPointer: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  createTexture: vi.fn(),
  bindTexture: vi.fn(),
  texImage2D: vi.fn(),
  texParameteri: vi.fn(),
  viewport: vi.fn(),
  clearColor: vi.fn(),
  clear: vi.fn(),
  drawArrays: vi.fn(),
  drawElements: vi.fn(),
  getUniformLocation: vi.fn(),
  uniform1f: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  uniform4f: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  blendFunc: vi.fn(),
  depthFunc: vi.fn(),
  activeTexture: vi.fn(),
  createFramebuffer: vi.fn(),
  bindFramebuffer: vi.fn(),
  framebufferTexture2D: vi.fn(),
  checkFramebufferStatus: vi.fn(() => 0x8cd5),
  getExtension: vi.fn(),
  readPixels: vi.fn(),
  getError: vi.fn(() => 0),
}

// jsdom has no real canvas implementation - return lightweight stubs.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((type: string) => {
    if (type === '2d') {
      return mock2dContext
    }
    if (type === 'webgl' || type === 'webgl2') {
      return mockWebGLContext
    }
    return null
  }),
})

// ResizeObserver is missing in jsdom and needed by responsive components.
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
})

// requestAnimationFrame allows animation loops to schedule in tests.
if (!globalThis.requestAnimationFrame) {
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    value: vi.fn((callback: FrameRequestCallback) => {
      return setTimeout(() => callback(Date.now()), 16) as unknown as number
    }),
    writable: true,
  })
}

if (!globalThis.cancelAnimationFrame) {
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {
    value: vi.fn((id: number) => clearTimeout(id)),
    writable: true,
  })
}

// matchMedia is required by components/hooks that branch on media queries.
if (!globalThis.matchMedia) {
  Object.defineProperty(globalThis, 'matchMedia', {
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    writable: true,
  })
}
