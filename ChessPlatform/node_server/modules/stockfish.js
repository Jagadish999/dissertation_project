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

// Function to get move evaluation from Stockfish
function getMoveEvaluation(fen, move, callback) {
  const stockfish = spawn(stockfishPath);

  stockfish.stdin.setEncoding('utf-8');

  stockfish.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.startsWith('info')) {
        const parts = line.split(' ');
        const evaluationIndex = parts.indexOf('cp');
        if (evaluationIndex !== -1) {
          const evaluationValue = parseInt(parts[evaluationIndex + 1]);
          callback(evaluationValue);
          stockfish.stdin.write('quit\n');
        }
      }
    }
  });

  stockfish.stdin.write('position fen ' + fen + '\n');
  stockfish.stdin.write('go depth 1 searchmoves ' + move + '\n');
}

// Function to classify a move based on its evaluation score
function classifyMove(evaluation) {
  if (evaluation >= 200) {
    return 'Brilliant Move';
  } else if (evaluation >= 100) {
    return 'Great Move';
  } else if (evaluation >= 50) {
    return 'Excellent Move';
  } else if (evaluation >= 20) {
    return 'Best Move';
  } else if (evaluation >= 0) {
    return 'Good Move';
  } else {
    return 'Blunder';
  }
}

module.exports = {
  getBestMove,
  getMoveEvaluation,
  classifyMove,
};
