// gradient.js — WebGL smoke-like gradient animation
// This script draws a blue-violet smoke simulation on a full‑screen canvas.
(function(){
  const canvas = document.getElementById('gradient-canvas');
  if (!canvas) return;
  const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  const gl = canvas.getContext('webgl', { alpha: true });
  if (!gl) return;

  const vertSrc = `
    attribute vec2 a_pos;
    void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;
  const fragSrc = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;
    
    float hash(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float noise(vec2 p){
      vec2 i = floor(p), f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
    }
    float fbm(vec2 p){
      float v = 0.0, a = 0.5;
      for(int i=0;i<6;i++){
        v += a * noise(p);
        p = mat2(1.6,1.2,-1.2,1.6)*p + 2.0;
        a *= 0.5;
      }
      return v;
    }
    vec3 palette(float x){
      vec3 c1 = vec3(0.0, 0.455, 0.569);
      vec3 c2 = vec3(0.278, 0.078, 0.263);
      x = smoothstep(0.2, 0.8, x);
      return mix(c1, c2, x);
    }
    void main(){
      vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      float t = u_time * 0.05;
      vec2 warp = vec2(fbm(uv*3.0 + t), fbm(uv*3.0 - t));
      float n = fbm(uv*1.5 + warp*0.5 + t);
      vec3 col = palette(n);
      gl_FragColor = vec4(col, 1.0);
    }
  `;
  function compile(type, src){
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  }
  const vs = compile(gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 1,-1, -1,1,
    -1,1, 1,-1, 1,1
  ]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  function resize(){
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();
  const start = performance.now();
  (function loop(now){
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(loop);
  })(performance.now());
})();
