
class Player {
    constructor(scene, inputController, camera) {
        this.scene = scene;
        this.inputController = inputController;
        this.camera = camera; // Store the camera reference
        this.model = this._createModel();
        this.scene.add(this.model);

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.moveSpeed = 5.0;
        this.gravity = -9.8;
        this.jumpHeight = 6.0;

        this.isFlying = false;
        this.flySpeed = 10.0;
        this.isJumping = false;

        // Debounce for flight mode
        this.fKeyDown = false;
    }

    _createModel() {
        const playerGroup = new THREE.Group();

        // Torso
        const torsoGeometry = new THREE.BoxGeometry(1, 1.5, 0.5);
        const torsoMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.castShadow = true;
        playerGroup.add(torso);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.1;
        head.castShadow = true;
        playerGroup.add(head);

        // Cape
        const capeGeometry = new THREE.PlaneGeometry(1.5, 2, 1);
        const capeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000, side: THREE.DoubleSide });
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.y = -0.25;
        cape.position.z = -0.3;
        cape.rotation.x = Math.PI / 12;
        cape.castShadow = true;
        playerGroup.add(cape);

        return playerGroup;
    }

    update(deltaTime) {
        // Flight mode toggle
        if (this.inputController.isPressed('KeyF') && !this.fKeyDown) {
            this.isFlying = !this.isFlying;
            this.velocity.y = 0; // Reset vertical velocity when toggling
        }
        this.fKeyDown = this.inputController.isPressed('KeyF');

        const camera = this.camera.camera; // Get the actual THREE.Camera

        if (this.isFlying) {
            this._handleFlying(deltaTime, camera);
        } else {
            this._handleWalking(deltaTime, camera);
        }

        // Apply velocity
        this.model.position.x += this.velocity.x * deltaTime;
        this.model.position.y += this.velocity.y * deltaTime;
        this.model.position.z += this.velocity.z * deltaTime;
        
        // Rotate player to face movement direction
        if (this.velocity.x !== 0 || this.velocity.z !== 0) {
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            this.model.rotation.y = angle;
        }


        // Ground collision
        if (!this.isFlying && this.model.position.y < 0.75) {
            this.model.position.y = 0.75;
            this.velocity.y = 0;
            this.isJumping = false;
        }
    }

    _handleWalking(deltaTime, camera) {
        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;

        // Get camera direction
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

        let moveDirection = new THREE.Vector3(0, 0, 0);
        if (this.inputController.isPressed('KeyW')) {
            moveDirection.add(forward);
        }
        if (this.inputController.isPressed('KeyS')) {
            moveDirection.sub(forward);
        }
        if (this.inputController.isPressed('KeyA')) {
            moveDirection.add(right);
        }
        if (this.inputController.isPressed('KeyD')) {
            moveDirection.sub(right);
        }

        moveDirection.normalize();
        this.velocity.x = moveDirection.x * this.moveSpeed;
        this.velocity.z = moveDirection.z * this.moveSpeed;

        // Jumping
        if (this.inputController.isPressed('Space') && !this.isJumping) {
            this.velocity.y = this.jumpHeight;
            this.isJumping = true;
        }
    }

    _handleFlying(deltaTime, camera) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        // No Y normalization for flying

        const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

        let moveDirection = new THREE.Vector3(0, 0, 0);
        if (this.inputController.isPressed('KeyW')) {
            moveDirection.add(forward);
        }
        if (this.inputController.isPressed('KeyS')) {
            moveDirection.sub(forward);
        }
        if (this.inputController.isPressed('KeyA')) {
            moveDirection.add(right);
        }
        if (this.inputController.isPressed('KeyD')) {
            moveDirection.sub(right);
        }
        if (this.inputController.isPressed('Space')) { // Fly up
            moveDirection.y += 1;
        }
        if (this.inputController.isPressed('ShiftLeft') || this.inputController.isPressed('ShiftRight')) { // Fly down
            moveDirection.y -= 1;
        }

        moveDirection.normalize();
        this.velocity.x = moveDirection.x * this.flySpeed;
        this.velocity.y = moveDirection.y * this.flySpeed;
        this.velocity.z = moveDirection.z * this.flySpeed;
    }
}
