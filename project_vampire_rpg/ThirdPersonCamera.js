/**
 * A smooth, third-person camera that follows a target object.
 */
class ThirdPersonCamera {
    /**
     * @param {THREE.PerspectiveCamera} camera The camera object to control.
     * @param {THREE.Object3D} target The target object to follow.
     */
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;

        // Internal vectors for smooth interpolation
        this.currentPosition = new THREE.Vector3();
        this.currentLookat = new THREE.Vector3();

        // The desired camera position relative to the target
        this.idealOffset = new THREE.Vector3(0, 5, -8); // Behind and above the player
    }

    /**
     * Updates the camera's position and orientation each frame.
     * @param {number} deltaTime The time elapsed since the last frame.
     */
    update(deltaTime) {
        // Calculate the ideal position for the camera
        const idealPosition = new THREE.Vector3().copy(this.idealOffset);
        idealPosition.add(this.target.position);

        // Use a smooth interpolation for camera movement
        const t = 1.0 - Math.pow(0.01, deltaTime); // Frame-rate independent interpolation
        this.currentPosition.lerp(idealPosition, t);

        // Set the camera's position and make it look at the target
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.target.position);
    }
}