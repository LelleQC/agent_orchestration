const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const Game = {
    gridSize: 20,
    canvasSize: canvas.width,
    score: 0,
    snake: [],
    food: {},
    direction: 'right',
    changingDirection: false,
    gameEnded: false,

    init: function() {
        this.score = 0;
        this.snake = [{ x: 10 * this.gridSize, y: 10 * this.gridSize }];
        this.direction = 'right';
        this.gameEnded = false;
        scoreElement.textContent = this.score;
        document.addEventListener('keydown', this.changeDirection.bind(this));
        this.placeFood();
    },

    tick: function() {
        if (this.gameEnded) return;
        this.update();
        this.draw();
    },

    placeFood: function() {
        this.food.x = Math.floor(Math.random() * (this.canvasSize / this.gridSize)) * this.gridSize;
        this.food.y = Math.floor(Math.random() * (this.canvasSize / this.gridSize)) * this.gridSize;
    },

    draw: function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        ctx.fillStyle = '#333';
        this.snake.forEach(part => {
            ctx.fillRect(part.x, part.y, this.gridSize, this.gridSize);
        });
        ctx.fillStyle = 'red';
        ctx.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);
    },

    update: function() {
        this.changingDirection = false;
        const head = { x: this.snake[0].x, y: this.snake[0].y };

        switch (this.direction) {
            case 'up': head.y -= this.gridSize; break;
            case 'down': head.y += this.gridSize; break;
            case 'left': head.x -= this.gridSize; break;
            case 'right': head.x += this.gridSize; break;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            scoreElement.textContent = this.score;
            this.placeFood();
        } else {
            this.snake.pop();
        }

        if (this.hasCollision()) {
            this.gameOver();
        }
    },

    hasCollision: function() {
        const head = this.snake[0];
        if (head.x < 0 || head.x >= this.canvasSize || head.y < 0 || head.y >= this.canvasSize) {
            return true;
        }
        for (let i = 4; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    },

    changeDirection: function(event) {
        if (this.changingDirection) return;
        this.changingDirection = true;

        const keyPressed = event.key;
        const goingUp = this.direction === 'up';
        const goingDown = this.direction === 'down';
        const goingLeft = this.direction === 'left';
        const goingRight = this.direction === 'right';

        if (keyPressed === 'ArrowUp' && !goingDown) this.direction = 'up';
        else if (keyPressed === 'ArrowDown' && !goingUp) this.direction = 'down';
        else if (keyPressed === 'ArrowLeft' && !goingRight) this.direction = 'left';
        else if (keyPressed === 'ArrowRight' && !goingLeft) this.direction = 'right';
    },

    gameOver: function() {
        this.gameEnded = true;
        ctx.fillStyle = 'black';
        ctx.font = '40px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', this.canvasSize / 2, this.canvasSize / 2);
    },

    // --- For Testing Purposes ---
    getGameState: function() {
        return {
            snake: this.snake,
            food: this.food,
            score: this.score,
            direction: this.direction,
            gameEnded: this.gameEnded
        };
    },

    placeFoodAt: function(x, y) {
        this.food.x = x;
        this.food.y = y;
    }
};

Game.init();

// Expose the Game object to the window for testing and general access
window.Game = Game;

// Start the real-time loop only if not in a test environment.
if (typeof window.__IS_PUPPETEER__ === 'undefined') {
    setInterval(() => Game.tick(), 100);
}