// cad.js — 3D viewer for CAD models with slicing functionality
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';

const viewerEl = document.getElementById('viewer');
const axisSelect = document.getElementById('axis-select');
const planeRange = document.getElementById('plane-range');

let scene, camera, renderer, controls;
let plane;

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
    renderer.localClippingEnabled = true;
    viewerEl.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    // Placeholder geometry (cube) for CAD models
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // Use multiple materials to better visualize clipping
    const material = new THREE.MeshStandardMaterial({ color: 0x8888ff, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide, clippingPlanes: [] });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    // Initialize clipping plane along X axis
    plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    renderer.clippingPlanes = [plane];
    // Event listeners for controls
    axisSelect.addEventListener('change', updatePlaneOrientation);
    planeRange.addEventListener('input', updatePlanePosition);
    window.addEventListener('resize', onWindowResize);
    animate();
}

function updatePlaneOrientation() {
    const axis = axisSelect.value;
    if (axis === 'x') {
        plane.normal.set(1, 0, 0);
    } else if (axis === 'y') {
        plane.normal.set(0, 1, 0);
    } else {
        plane.normal.set(0, 0, 1);
    }
    planeRange.value = 0;
    plane.constant = 0;
}

function updatePlanePosition() {
    const value = parseFloat(planeRange.value);
    plane.constant = value;
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