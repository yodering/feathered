import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, model, controls;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.set(0, 0, 15);

    // Create renderer with transparent background
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.6);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.getElementById('model-container').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Load model
    const loader = new GLTFLoader();
    loader.load(
        '/feather.glb', // Make sure this path is correct
        function (gltf) {
            // Remove any existing model
            if (model) {
                scene.remove(model);
            }
            
            model = gltf.scene;
            
            // Center and scale the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 12 / maxDim; // Increased scale factor
            model.scale.multiplyScalar(scale);
            
            model.position.sub(center.multiplyScalar(scale));
            
            scene.add(model);
            
            // Adjust camera position based on model size
            camera.position.z = maxDim * 0.3; // Moved camera closer
            camera.updateProjectionMatrix();
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened', error);
        }
    );

    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (model) {
        model.rotation.y += 0.005; // Rotate the model
    }
    
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.6);
}

window.addEventListener('resize', onWindowResize);

// Initialize the 3D scene
init();

export { init };