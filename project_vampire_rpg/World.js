/**
 * Manages the game world's environment, including ground, trees, and other scenery.
 */
class World {
    /**
     * @param {THREE.Scene} scene The scene to add world objects to.
     */
    constructor(scene) {
        this.scene = scene;
        this._createGround();
        this._createTrees();
        this._createRocks();
    }

    /**
     * Creates a large, flat ground plane for the world.
     * @private
     */
    _createGround() {
        const groundGeometry = new THREE.PlaneGeometry(500, 500);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a }); // Darker ground
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        ground.receiveShadow = true; // Ground will receive shadows
        this.scene.add(ground);
    }

    /**
     * Procedurally generates and places a large number of trees in the world.
     * @private
     */
    _createTrees() {
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3b2a }); // Darker, desaturated brown
        const leavesMat = new THREE.MeshStandardMaterial({ color: 0x1a3a1a }); // Dark, black-green

        for (let i = 0; i < 200; i++) {
            // Randomize tree dimensions
            const trunkHeight = Math.random() * 4 + 2; // 2 to 6
            const leavesRadius = Math.random() * 1 + 1.5; // 1.5 to 2.5
            const leavesHeight = Math.random() * 3 + 4; // 4 to 7

            const trunkGeo = new THREE.CylinderGeometry(0.5, 0.5, trunkHeight);
            const leavesGeo = new THREE.ConeGeometry(leavesRadius, leavesHeight, 8);

            const tree = new THREE.Group();
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = trunkHeight / 2;
            trunk.castShadow = true;
            const leaves = new THREE.Mesh(leavesGeo, leavesMat);
            leaves.position.y = trunkHeight + leavesHeight / 2 - 1;
            leaves.castShadow = true;
            tree.add(trunk, leaves);

            const x = (Math.random() - 0.5) * 480;
            const z = (Math.random() - 0.5) * 480;

            // Avoid placing trees too close to the center (spawn area)
            if (x * x + z * z < 100) continue;

            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }

    /**
     * Procedurally generates and places rocks of various sizes in the world.
     * @private
     */
    _createRocks() {
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Darker grey
        const rockGeometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.DodecahedronGeometry(1, 0)
        ];

        for (let i = 0; i < 100; i++) {
            const rockGeo = rockGeometries[Math.floor(Math.random() * rockGeometries.length)];
            const newRock = new THREE.Mesh(rockGeo, rockMat);
            const x = (Math.random() - 0.5) * 480;
            const z = (Math.random() - 0.5) * 480;
            const scale = Math.random() * 2 + 0.5; // Randomize size

            // Avoid placing rocks too close to the center
            if (x * x + z * z < 50) continue;

            newRock.position.set(x, scale / 2, z);
            newRock.scale.set(scale, scale, scale);
            newRock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            newRock.castShadow = true;
            this.scene.add(newRock);
        }
    }

    // Methods for adding trees, rocks, etc. will go here
}