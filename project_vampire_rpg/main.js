// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00001a);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.z = 5;

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x202040, 1); // Darker, more intense blue ambient light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0x80a0ff, 0.8); // Blueish moonlight
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true; // The moon casts shadows
scene.add(directionalLight);

// World
const world = new World(scene);

// Input Controller
const inputController = new InputController();

// Camera
const thirdPersonCamera = new ThirdPersonCamera(camera, null);

// Player
const player = new Player(scene, inputController, thirdPersonCamera);

thirdPersonCamera.target = player.model;

// Handle Window Resizing
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

const clock = new THREE.Clock();

// 5. Animation Loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    player.update(deltaTime);
    thirdPersonCamera.update(deltaTime);

    renderer.render(scene, camera);
}

animate(); // Start the loop