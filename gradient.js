import React, { useEffect, useRef } from "react";

// GasBackground — fullscreen, aesthetic blue/purple gas with gentle turbulence.
// Fixes:
// 1) Robust shader compile/link checks BEFORE attachShader (prevents null attach).
// 2) Corrected GLSL hash() to return a float (previously returned vec2 → compile fail).
// 3) Removed TypeScript non-null assertions in runtime calls.
// 4) Added lightweight runtime self-tests (console.assert) as "test cases".
// 5) Graceful teardown & ResizeObserver fallback.

export default function GasBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      depth: false,
      stencil: false,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      console.error("WebGL not supported: getContext('webgl') returned null");
      return;
    }

    // Vertex shader (full-screen triangle)
    const vertSrc = `
      attribute vec2 position;
      void main(){
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader: domain-warped fbm noise, two-gas palette (blue/purple)
    const fragSrc = `
      precision highp float;

      uniform vec2 u_res;
      uniform float u_time;

      // ---- Noise utilities ----
      float hash(vec2 p){
        // Fixed: return a float, not a vec2
        // Classic 2D hash via dot → sin → fract
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      float fbm(vec2 p){
        float s = 0.0;
        float a = 0.5;
        mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
        for(int i=0;i<5;i++){
          s += a * noise(p);
          p = m * p;
          a *= 0.5;
        }
        return s;
      }

      vec3 palette(float t){
        // Two-gas palette: indigo → violet-blue → airy cyan highlights
        vec3 c1 = vec3(0.14, 0.12, 0.23);
        vec3 c2 = vec3(0.20, 0.21, 0.52);
        vec3 c3 = vec3(0.48, 0.34, 0.74);
        vec3 c4 = vec3(0.46, 0.70, 0.87);
        vec3 a = mix(c1, c2, smoothstep(0.05, 0.35, t));
        vec3 b = mix(c3, c4, smoothstep(0.45, 0.95, t));
        return mix(a, b, smoothstep(0.25, 0.85, t));
      }

      void main(){
        // Centered coords with aspect preserved via y
        vec2 p = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;

        // Slow drift
        float t = u_time * 0.06;

        // Domain warp for gentle turbulence
        vec2 q = vec2(
          fbm(p*1.3 + vec2(t*0.9, -t*0.5)),
          fbm(p*1.3 + vec2(-t*0.6, t*0.7))
        );
        vec2 r = vec2(
          fbm(p*2.1 + 2.0*q + vec2(t*0.2, -t*0.1)),
          fbm(p*2.1 + 2.0*q + vec2(-t*0.15, t*0.25))
        );

        float n = fbm(p*2.2 + 1.5*r);
        float n2 = fbm(p*0.9 - 0.8*q + vec2(0.0, t*0.3));
        float v = smoothstep(0.2, 0.9, 0.55*n + 0.45*n2);

        vec3 col = palette(v);

        // Subtle vignetting for depth
        float vign = smoothstep(1.2, 0.2, length(p));
        col *= mix(0.9, 1.08, vign);

        // Very light bloom-ish lift in brighter pockets
        col += 0.03 * pow(v, 3.0);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // --- Compile & link with guards ---
    const compile = (type, src, label) => {
      const sh = gl.createShader(type);
      if (!sh) {
        console.error(`createShader failed for ${label}`);
        return null;
      }
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      const ok = gl.getShaderParameter(sh, gl.COMPILE_STATUS);
      const log = gl.getShaderInfoLog(sh) || "";
      if (!ok) {
        console.error(`${label} compile error:\n${log}`);
        gl.deleteShader(sh);
        return null;
      }
      if (log.trim()) {
        // Non-fatal warnings
        console.debug(`${label} compile log:\n${log}`);
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, vertSrc, "VertexShader");
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc, "FragmentShader");
    if (!vs || !fs) {
      console.error("Aborting: shader compilation failed.");
      return;
    }

    const prog = gl.createProgram();
    if (!prog) {
      console.error("createProgram failed");
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    const linked = gl.getProgramParameter(prog, gl.LINK_STATUS);
    if (!linked) {
      console.error("Program link error:\n" + (gl.getProgramInfoLog(prog) || ""));
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(prog);

    // --- Full-screen triangle ---
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const tri = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, tri, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    // --- Basic runtime self-tests ("test cases") ---
    console.assert(gl instanceof WebGLRenderingContext, "[TEST] WebGL context acquired");
    console.assert(vs && fs, "[TEST] Shaders compiled");
    console.assert(linked, "[TEST] Program linked");
    console.assert(loc !== -1, "[TEST] Attribute 'position' active");
    console.assert(uRes !== null && uTime !== null, "[TEST] Uniforms located");

    const setSize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Resize handling with fallback
    let obs;
    if ("ResizeObserver" in window) {
      obs = new ResizeObserver(() => setSize());
      obs.observe(canvas);
    } else {
      const onResize = () => setSize();
      window.addEventListener("resize", onResize);
    }

    setSize();

    let start = performance.now();
    const loop = (now) => {
      const t = (now - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (obs && obs.disconnect) obs.disconnect();
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      if (buf) gl.deleteBuffer(buf);
      gl.useProgram(null);
      gl.detachShader(prog, vs);
      gl.detachShader(prog, fs);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
