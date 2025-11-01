// This script simply loads the full Stockfish engine into the worker's context.
// The main thread creates a Worker instance pointing to this file.
// The imported script then takes over the worker's global scope.

importScripts("https://cdn.jsdelivr.net/npm/stockfish@17.1.0/src/stockfish-nnue-17.1-single.js");