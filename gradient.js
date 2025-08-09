# Составим новый gradient.js на основе шейдеров из react_code
vertex_shader_code = glsl_blocks[0]
fragment_shader_code = glsl_blocks[1]

new_gradient_js = f"""
(function() {{
    const canvas = document.getElementById('gradient-canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {{
        console.error('WebGL not supported');
        return;
    }}

    function resizeCanvas() {{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }}
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const vertexShaderSource = `{vertex_shader_code}`;
    const fragmentShaderSource = `{fragment_shader_code}`;

    function createShader(gl, type, source) {{
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {{
            console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }}
        return shader;
    }}

    function createProgram(gl, vertexShader, fragmentShader) {{
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {{
            console.error('Program link failed:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }}
        return program;
    }}

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

    function render() {{
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindVertexArray(vao);

        gl.uniform2f(resolutionLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }}
    requestAnimationFrame(render);
}})();
"""

# Сохраним новый файл
with open("/mnt/data/gradient_new.js", "w", encoding="utf-8") as f:
    f.write(new_gradient_js)

"/mnt/data/gradient_new.js"

