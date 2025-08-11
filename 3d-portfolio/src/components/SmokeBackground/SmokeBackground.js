import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SmokeShaderMaterial = {
  uniforms: {
    uTime: { value: 0.0 },
    uColor1: { value: new THREE.Color(0x6a0dad) }, // Purple
    uColor2: { value: new THREE.Color(0x0000ff) }, // Blue
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;

    // 2D Random
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    // Fractional Brownian Motion
    float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 0.0;

        for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
      vec2 st = vUv * 3.0;
      st.x += uTime * 0.05;
      float smoke = fbm(st);
      vec3 color = mix(uColor1, uColor2, vUv.y);
      gl_FragColor = vec4(color, smoke);
    }
  `,
};

const Smoke = () => {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeBufferGeometry args={[window.innerWidth, window.innerHeight, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        args={[SmokeShaderMaterial]}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

const SmokeBackground = () => {
  return (
    <Canvas style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Smoke />
    </Canvas>
  );
};

export default SmokeBackground;
