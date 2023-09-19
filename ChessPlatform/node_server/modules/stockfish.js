// modules/stockfish.js
const { spawn } = require('child_process');

// Path to the Stockfish binary
const stockfishPath = './stockfish/stockfish-windows-x86-64-avx2.exe';

// Function to get the best move from Stockfish
function getBestMove(fen, depth, callback) {

    console.log("Received: " + fen);
  const stockfish = spawn(stockfishPath);

  stockfish.stdin.setEncoding('utf-8');

  stockfish.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.startsWith('bestmove')) {
        const parts = line.split(' ');
        const bestMove = parts[1];
        callback(bestMove);
        stockfish.stdin.write('quit\n');
      }
    }
  });

  stockfish.stdin.write('position fen ' + fen + '\n');
  stockfish.stdin.write('go depth ' + depth + ' movetime 2000' +'\n');
}

module.exports = {
  getBestMove
};
