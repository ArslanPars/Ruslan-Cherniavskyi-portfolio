
(function() {
    const canvas = document.getElementById('gradient-canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `
      attribute vec2 position;
      void main(){
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;
    const fragmentShaderSource = `
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

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link failed:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1]), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    let startTime = Date.now();

    function render() {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();
