window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Game dimensions
    canvas.width = 375; // Typical mobile width
    canvas.height = 667; // Typical mobile height


    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = game.width;
            this.height = game.height;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.y >= this.height) {
                this.y = 0;
            }
            this.y -= this.game.player.speedY * this.speedModifier;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            this.layer1image = new Image();
            this.layer1image.src = 'background-layer-1.svg';
            this.layer2image = new Image();
            this.layer2image.src = 'background-layer-2.svg';
            this.layer3image = new Image();
            this.layer3image.src = 'background-layer-3.svg';
            
            this.layer1 = new Layer(this.game, this.layer1image, 0.2);
            this.layer2 = new Layer(this.game, this.layer2image, 0.4);
            this.layer3 = new Layer(this.game, this.layer3image, 1);

            this.backgroundLayers = [this.layer1, this.layer2, this.layer3];
        }

        update() {
            this.backgroundLayers.forEach(layer => {
                layer.update();
            });
        }

        draw(context) {
            this.backgroundLayers.forEach(layer => {
                layer.draw(context);
            });
        }
    }

    class InputHandler {

        constructor(game) {
            this.game = game;
            this.keys = [];
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter') && this.keys.indexOf(e.key) === -1) {
                    this.keys.push(e.key);
                }
            });
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Enter') {
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
            this.image = new Image();
            this.image.src = 'character.svg';
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
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
            this.game.sound.playJumpSound();
            for (let i = 0; i < 10; i++) {
                this.game.particles.push(new Particle(this.game, this.x + this.width / 2, this.y + this.height));
            }
        }
    }

    class Particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.size = Math.random() * 5 + 5;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = 'rgba(173, 216, 230, 0.5)'; // Light blue
            this.life = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02;
        }

        draw(context) {
            context.globalAlpha = this.life;
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fill();
            context.globalAlpha = 1;
        }
    }

    class Sound {
        constructor() {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        playJumpSound() {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);

            oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + 0.1);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }



    class Platform {
        constructor(game, x, y) {
            this.game = game;
            this.width = 100;
            this.height = 20;
            this.x = x;
            this.y = y;
            this.image = new Image();
            this.image.src = 'platform.svg';
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.gameState = 'start';
            this.background = new Background(this);
            this.input = new InputHandler(this);
            this.player = new Player(this); // Instantiate the player
            this.platforms = [];
            this.particles = [];
            this.sound = new Sound();
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
            if (this.gameState === 'start') {
                if (this.input.keys.includes('Enter')) {
                    this.gameState = 'running';
                }
                return;
            }

            if (this.gameState === 'gameOver') {
                if (this.input.keys.includes('Enter')) {
                    this.restart();
                }
                return;
            }

            this.player.update();

            // Update particles
            this.particles.forEach((particle, index) => {
                particle.update();
                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                }
            });

            // Camera scrolling
            if (this.player.y < this.height / 2 && this.player.speedY < 0) {
                this.player.y = this.height / 2;
                this.background.update();
                this.platforms.forEach(platform => {
                    platform.y -= this.player.speedY; // speedY is negative, so this adds to y
                });
            }

            // Game Over condition
            if (this.player.y > this.height) {
                this.gameState = 'gameOver';
            }
        }

        draw() {
            // Clear the canvas
            this.ctx.clearRect(0, 0, this.width, this.height);

            if (this.gameState === 'start') {
                this.ctx.fillStyle = 'black';
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Doodle Jump Ultimate', this.width / 2, this.height / 2 - 40);
                this.ctx.font = '20px Arial';
                this.ctx.fillText('Press Enter to Start', this.width / 2, this.height / 2);
                return;
            }

            if (this.gameState === 'gameOver') {
                this.ctx.fillStyle = 'black';
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('Game Over', this.width / 2, this.height / 2 - 40);
                this.ctx.font = '20px Arial';
                this.ctx.fillText('Press Enter to Restart', this.width / 2, this.height / 2);
                return;
            }

            this.background.draw(this.ctx);
            this.platforms.forEach(platform => platform.draw(this.ctx));
            this.particles.forEach(particle => particle.draw(this.ctx));
            this.player.draw(this.ctx);
        }

        restart() {
            this.player.x = (this.width - this.player.width) / 2;
            this.player.y = this.height - this.player.height - 20;
            this.player.speedX = 0;
            this.player.speedY = 0;
            this.platforms = [];
            this.createPlatforms();
            this.player.jump();
            this.gameState = 'running';
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