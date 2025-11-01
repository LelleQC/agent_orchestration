window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game dimensions
    canvas.width = 375; // Typical mobile width
    canvas.height = 667; // Typical mobile height

    class InputHandler {
        constructor(game) {
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
            });
        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 40;
            this.height = 60;
            this.x = (this.game.width - this.width) / 2;
            this.y = this.game.height - this.height - 20;
            this.speedX = 0;
            this.speedY = 0;
        }

        draw(context) {
            context.fillStyle = 'blue';
            context.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            // Horizontal movement
            const horizontalSpeed = 5;
            if (this.game.input.keys.includes('ArrowRight')) {
                this.speedX = horizontalSpeed;
            } else if (this.game.input.keys.includes('ArrowLeft')) {
                this.speedX = -horizontalSpeed;
            } else {
                this.speedX = 0;
            }
            this.x += this.speedX;

            // Horizontal boundaries
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > this.game.width) this.x = this.game.width - this.width;

            // Vertical movement
            this.speedY += this.game.gravity;
            this.y += this.speedY;

            // Collision detection with platforms
            this.game.platforms.forEach(platform => {
                if (
                    this.speedY > 0 && // Player is falling
                    this.x < platform.x + platform.width &&
                    this.x + this.width > platform.x &&
                    this.y + this.height > platform.y &&
                    this.y + this.height < platform.y + platform.height
                ) {
                    this.jump();
                }
            });
        }

        jump() {
            this.speedY = this.game.jumpStrength;
        }
    }

    class Platform {
        constructor(game, x, y) {
            this.game = game;
            this.width = 100;
            this.height = 20;
            this.x = x;
            this.y = y;
        }

        draw(context) {
            context.fillStyle = 'green';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.input = new InputHandler(this);
            this.player = new Player(this); // Instantiate the player
            this.platforms = [];
            this.createPlatforms();
            this.gravity = 0.5;
            this.jumpStrength = -15;

            // Initial jump
            this.player.jump();
        }

        createPlatforms() {
            const platformCount = 10;
            for (let i = 0; i < platformCount; i++) {
                const x = Math.random() * (this.width - 100); // -100 for platform width
                const y = (this.height / platformCount) * i;
                this.platforms.push(new Platform(this, x, y));
            }
            // Ensure there's a platform for the player to start on
            const startPlatformY = this.height - 50;
            this.platforms.push(new Platform(this, (this.width - 100) / 2, startPlatformY));
            this.player.y = startPlatformY - this.player.height;
        }

        update() {
            this.player.update();

            // Camera scrolling
            if (this.player.y < this.height / 2 && this.player.speedY < 0) {
                this.player.y = this.height / 2;
                this.platforms.forEach(platform => {
                    platform.y -= this.player.speedY; // speedY is negative, so this adds to y
                });
            }

            // Game Over condition
            if (this.player.y > this.height) {
                alert('Game Over!');
                document.location.reload();
            }
        }

        draw() {
            // Clear the canvas
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.platforms.forEach(platform => platform.draw(this.ctx));
            this.player.draw(this.ctx);
        }

        getGameState() {
            return {
                player: {
                    x: this.player.x,
                    y: this.player.y,
                    speedX: this.player.speedX,
                    speedY: this.player.speedY
                }
            };
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    console.log("Game object created:", game);

    // Main game loop
    function gameLoop() {
        game.update();
        game.draw();

        // Request the next frame
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    console.log("Starting game loop...");
    gameLoop();
});