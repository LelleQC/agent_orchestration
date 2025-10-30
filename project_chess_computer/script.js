const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const newGameButton = document.getElementById('newGameButton');

const ChessGame = {
    game: new Chess(),
    stockfish: null,
    selectedSquare: null,
    pieceUnicode: {
        p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔',
        P: '♟', R: '♜', N: '♞', B: '♝', Q: '♛', K: '♚'
    },

    init: function() {
        this.game = new Chess();
        this.selectedSquare = null;
        this.renderBoard();
        this.updateStatus();
        newGameButton.addEventListener('click', () => this.init());

        // Initialize Stockfish worker
        this.stockfish = new Worker('stockfish_worker.js');
        this.stockfish.onmessage = (event) => {
            const message = event.data;
            if (message.startsWith('bestmove')) {
                const bestMove = message.split(' ')[1];
                this.game.move(bestMove, { sloppy: true });
                this.renderBoard();
                this.updateStatus();
            }
        };
        this.stockfish.postMessage('uci');
        this.stockfish.postMessage('isready');
        // Set difficulty to approximate Elo 2000. Skill Level 10 of 20 is a good start.
        this.stockfish.postMessage('setoption name Skill Level value 10');
    },

    renderBoard: function() {
        // (This function remains largely the same as before)
        boardElement.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                const squareName = String.fromCharCode(97 + j) + (8 - i);
                square.dataset.square = squareName;
                const isLight = (i + j) % 2 !== 0;
                square.className = 'square ' + (isLight ? 'light' : 'dark');
                const piece = this.game.get(squareName);
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.className = 'piece';
                    pieceElement.innerHTML = this.pieceUnicode[piece.type] || '';
                    pieceElement.style.color = piece.color === 'w' ? '#fff' : '#000';
                    square.appendChild(pieceElement);
                }
                square.addEventListener('click', () => this.handleSquareClick(squareName));
                boardElement.appendChild(square);
            }
        }
        if (this.selectedSquare) {
            const el = document.querySelector(`[data-square="${this.selectedSquare}"]`);
            if (el) el.classList.add('selected');
        }
    },

    handleSquareClick: function(squareName) {
        // Only allow moves if it's the user's (White's) turn
        if (this.game.turn() !== 'w') return;

        const piece = this.game.get(squareName);

        if (this.selectedSquare) {
            const move = this.game.move({
                from: this.selectedSquare,
                to: squareName,
                promotion: 'q'
            });

            if (move === null) {
                this.selectedSquare = null;
                this.renderBoard();
                return;
            }

            this.renderBoard();
            this.updateStatus();
            this.selectedSquare = null;

            // If the game isn't over, ask the computer to move
            if (!this.game.game_over()) {
                this.askComputerToMove();
            }

        } else if (piece && piece.color === 'w') {
            this.selectedSquare = squareName;
            this.renderBoard();
        }
    },

    askComputerToMove: function() {
        statusElement.textContent = 'Computer is thinking...';
        this.stockfish.postMessage(`position fen ${this.game.fen()}`);
        // Set a thinking time of 1.5 seconds to simulate a strong player
        this.stockfish.postMessage('go movetime 1500');
    },

    updateStatus: function() {
        let statusText = '';
        const turn = this.game.turn() === 'w' ? 'White' : 'Black';

        if (this.game.in_checkmate()) {
            statusText = `Checkmate! ${turn === 'White' ? 'Black' : 'White'} wins.`;
        } else if (this.game.in_draw()) {
            statusText = 'Draw!';
        } else {
            statusText = `${turn}'s turn`;
            if (this.game.in_check()) {
                statusText += ' (in check)';
            }
        }
        statusElement.textContent = statusText;
    }
};

ChessGame.init();
window.ChessGame = ChessGame; // Expose for potential debugging
