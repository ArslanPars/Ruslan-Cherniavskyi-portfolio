// common.js — 3D viewer for the generic models page
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';

const viewerEl = document.getElementById('viewer');
let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);
    const aspect = viewerEl.clientWidth / viewerEl.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(2, 2, 2);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(viewerEl.clientWidth, viewerEl.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    viewerEl.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    // Add a simple cube as placeholder
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x8888ff, roughness: 0.4, metalness: 0.2 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Resize handler
    window.addEventListener('resize', onWindowResize);
    animate();
}

function onWindowResize() {
    if (!camera || !renderer) return;
    const aspect = viewerEl.clientWidth / viewerEl.clientHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(viewerEl.clientWidth, viewerEl.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

init();
