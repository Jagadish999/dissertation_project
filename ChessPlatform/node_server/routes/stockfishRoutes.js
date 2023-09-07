// routes/stockfishRoutes.js
const express = require('express');
const router = express.Router();
const stockfish = require('../modules/stockfish');

// Route to get the best move from Stockfish
router.post('/get-best-move', (req, res) => {
  const { fen, depth } = req.body;

  stockfish.getBestMove(fen, depth, (bestMove) => {
    res.json({ best_move: bestMove });
  });
});

module.exports = router;
