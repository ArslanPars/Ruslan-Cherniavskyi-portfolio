// app.js — logic for gallery rendering and 3D viewer

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/loaders/DRACOLoader.js';

const galleryEl = document.getElementById('gallery');
const modalEl = document.getElementById('viewer-modal');
const closeButton = modalEl.querySelector('.close-button');
const viewerContainer = document.getElementById('viewer-container');
const hdriSelect = document.getElementById('hdri-select');
const wireframeToggle = document.getElementById('wireframe-toggle');
const materialToggle = document.getElementById('material-toggle');

let scene, camera, renderer, controls;
let currentModel;
let originalMaterials = [];
let environmentMaps = [
    'studio_small_08_1k.hdr',
    'venice_sunset_1k.hdr'
];

async function loadGallery() {
    try {
        const response = await fetch('gallery.json');
        const data = await response.json();
        renderGallery(data.items || []);
    } catch (err) {
        console.error('Failed to load gallery.json', err);
    }
}

function renderGallery(items) {
    galleryEl.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-item';
        card.innerHTML = `
            <img src="${item.thumb}" alt="${item.title}">
            <h3>${item.title}</h3>
        `;
        card.addEventListener('click', () => openModal(item));
        galleryEl.appendChild(card);
    });
}

function initRenderer() {
    if (renderer) {
        renderer.dispose();
    }
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const aspect = viewerContainer.clientWidth / viewerContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(2, 2, 2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    viewerContainer.innerHTML = '';
    viewerContainer.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    window.addEventListener('resize', () => {
        const aspect = viewerContainer.clientWidth / viewerContainer.clientHeight;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

async function loadHDRI(path) {
    return new Promise((resolve, reject) => {
        const loader = new RGBELoader();
        loader.load(path, texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            resolve(texture);
        }, undefined, err => reject(err));
    });
}

function populateHDRIOptions(hdris) {
    hdriSelect.innerHTML = '';
    hdris.forEach(hdri => {
        const option = document.createElement('option');
        option.value = hdri;
        option.textContent = hdri;
        hdriSelect.appendChild(option);
    });
}

async function loadModel(item) {
    if (!scene) return;
    if (currentModel) {
        scene.remove(currentModel);
        currentModel.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material) child.material.dispose();
            }
        });
    }
    originalMaterials = [];
    currentModel = null;

    const url = item.model;
    const ext = url.split('.').pop().toLowerCase();
    let loader;
    if (ext === 'glb' || ext === 'gltf') {
        loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.154.0/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
    } else if (ext === 'stl') {
        loader = new STLLoader();
    } else if (ext === 'obj') {
        loader = new OBJLoader();
    } else {
        console.warn(`Unsupported format: ${ext}`);
        return;
    }

    try {
        if (loader instanceof GLTFLoader) {
            const gltf = await loader.loadAsync(url);
            currentModel = gltf.scene;
        } else if (loader instanceof STLLoader) {
            const geometry = await loader.loadAsync(url);
            const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            currentModel = new THREE.Mesh(geometry, material);
        } else if (loader instanceof OBJLoader) {
            currentModel = await loader.loadAsync(url);
        }
        currentModel.traverse(child => {
            if (child.isMesh) {
                originalMaterials.push(child.material);
            }
        });
        const box = new THREE.Box3().setFromObject(currentModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        currentModel.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        currentModel.scale.setScalar(scale);
        scene.add(currentModel);
        updateWireframe();
        updateMaterialOverride();
    } catch (err) {
        console.error('Error loading model', err);
    }
}

function updateWireframe() {
    if (!currentModel) return;
    const enable = wireframeToggle.checked;
    currentModel.traverse(child => {
        if (child.isMesh && child.material) {
            child.material.wireframe = enable;
        }
    });
}

function updateMaterialOverride() {
    if (!currentModel) return;
    const disableMaterials = materialToggle.checked;
    let materialIndex = 0;
    currentModel.traverse(child => {
        if (child.isMesh) {
            if (disableMaterials) {
                child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: wireframeToggle.checked });
            } else {
                const orig = originalMaterials[materialIndex++] || new THREE.MeshStandardMaterial({ color: 0xffffff });
                child.material = orig;
                child.material.wireframe = wireframeToggle.checked;
            }
        }
    });
}

async function openModal(item) {
    modalEl.classList.remove('hidden');
    initRenderer();
    const hdriList = item.hdris && item.hdris.length ? item.hdris : environmentMaps;
    populateHDRIOptions(hdriList);
    if (hdriList.length > 0) {
        try {
            const texture = await loadHDRI(`assets/hdr/${hdriList[0]}`);
            scene.environment = texture;
            scene.background = texture;
        } catch (err) {
            scene.environment = null;
        }
    } else {
        scene.environment = null;
    }
    await loadModel(item);
    animate();
}

function closeModal() {
    modalEl.classList.add('hidden');
    if (currentModel) {
        currentModel.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                if (child.material) child.material.dispose();
            }
        });
        currentModel = null;
    }
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    scene = null;
    camera = null;
    controls = null;
    viewerContainer.innerHTML = '';
}

closeButton.addEventListener('click', closeModal);
hdriSelect.addEventListener('change', async () => {
    const selected = hdriSelect.value;
    if (selected && scene) {
        try {
            const texture = await loadHDRI(`assets/hdr/${selected}`);
            scene.environment = texture;
            scene.background = texture;
        } catch (err) {
            console.error('Failed to load HDRI', err);
        }
    }
});
wireframeToggle.addEventListener('change', updateWireframe);
materialToggle.addEventListener('change', updateMaterialOverride);

loadGallery();
