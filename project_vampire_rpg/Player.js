
class Player {
    constructor(scene, inputController) {
        this.scene = scene;
        this.inputController = inputController;
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
        if (this.inputController.keys['f'] && !this.fKeyDown) {
            this.isFlying = !this.isFlying;
            this.velocity.y = 0; // Reset vertical velocity when toggling
        }
        this.fKeyDown = this.inputController.keys['f'];

        if (this.isFlying) {
            this._handleFlying(deltaTime);
        } else {
            this._handleWalking(deltaTime);
        }

        // Apply velocity
        this.model.position.x += this.velocity.x * deltaTime;
        this.model.position.y += this.velocity.y * deltaTime;
        this.model.position.z += this.velocity.z * deltaTime;

        // Ground collision
        if (!this.isFlying && this.model.position.y < 0.75) {
            this.model.position.y = 0.75;
            this.velocity.y = 0;
            this.isJumping = false;
        }
    }

    _handleWalking(deltaTime) {
        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;

        // Basic movement
        let moveDirection = new THREE.Vector3(0, 0, 0);
        if (this.inputController.keys['w']) {
            moveDirection.z -= 1;
        }
        if (this.inputController.keys['s']) {
            moveDirection.z += 1;
        }
        if (this.inputController.keys['a']) {
            moveDirection.x -= 1;
        }
        if (this.inputController.keys['d']) {
            moveDirection.x += 1;
        }

        moveDirection.normalize();
        this.velocity.x = moveDirection.x * this.moveSpeed;
        this.velocity.z = moveDirection.z * this.moveSpeed;

        // Jumping
        if (this.inputController.keys[' '] && !this.isJumping) {
            this.velocity.y = this.jumpHeight;
            this.isJumping = true;
        }
    }

    _handleFlying(deltaTime) {
        let moveDirection = new THREE.Vector3(0, 0, 0);
        if (this.inputController.keys['w']) {
            moveDirection.z -= 1;
        }
        if (this.inputController.keys['s']) {
            moveDirection.z += 1;
        }
        if (this.inputController.keys['a']) {
            moveDirection.x -= 1;
        }
        if (this.inputController.keys['d']) {
            moveDirection.x += 1;
        }
        if (this.inputController.keys[' ']) { // Fly up
            moveDirection.y += 1;
        }
        if (this.inputController.keys['shift']) { // Fly down
            moveDirection.y -= 1;
        }

        moveDirection.normalize();
        this.velocity.x = moveDirection.x * this.flySpeed;
        this.velocity.y = moveDirection.y * this.flySpeed;
        this.velocity.z = moveDirection.z * this.flySpeed;
    }
}
