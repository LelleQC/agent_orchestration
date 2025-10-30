
// Basic Three.js scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set background color to simulate the sky
scene.background = new THREE.Color(0x87ceeb);

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate it to be horizontal
scene.add(ground);

// Create a simple aircraft model
const aircraft = new THREE.Group();

const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const bodyGeometry = new THREE.ConeGeometry(0.5, 2, 8);
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.rotation.x = Math.PI / 2;
aircraft.add(body);

const wingMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1);
const wing = new THREE.Mesh(wingGeometry, wingMaterial);
wing.position.y = 0;
aircraft.add(wing);

scene.add(aircraft);

// Position the camera
camera.position.z = 10;
camera.position.y = 3;

// Keyboard controls
const keyboard = {};
document.addEventListener('keydown', (e) => keyboard[e.code] = true);
document.addEventListener('keyup', (e) => keyboard[e.code] = false);

function updateAircraft() {
    // Speed
    const speed = 0.1;

    // Move forward
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(aircraft.quaternion);
    aircraft.position.add(forward.multiplyScalar(speed));

    // Pitch
    if (keyboard['ArrowUp']) {
        aircraft.rotation.x -= 0.01;
    }
    if (keyboard['ArrowDown']) {
        aircraft.rotation.x += 0.01;
    }

    // Roll
    if (keyboard['ArrowLeft']) {
        aircraft.rotation.z += 0.01;
    }
    if (keyboard['ArrowRight']) {
        aircraft.rotation.z -= 0.01;
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    updateAircraft();

    // Camera follows the aircraft
    const offset = new THREE.Vector3(0, 2, 5);
    offset.applyQuaternion(aircraft.quaternion);
    camera.position.copy(aircraft.position).add(offset);
    camera.lookAt(aircraft.position);

    renderer.render(scene, camera);
}

animate();
