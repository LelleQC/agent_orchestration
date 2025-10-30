// This script simply loads the full Stockfish engine into the worker's context.
// The main thread creates a Worker instance pointing to this file.
// The imported script then takes over the worker's global scope.

importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish/15.0.0/stockfish.js");