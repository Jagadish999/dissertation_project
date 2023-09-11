const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stockfishRoutes = require('./routes/stockfishRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configure CORS to allow requests from http://localhost:8000
app.use(cors({
  origin: 'http://localhost:8000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials (if you need to)
}));

app.options('/stockfish-api/get-best-move', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8000');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.sendStatus(204); // No content in response for preflight request
});


// Define routes
app.use('/stockfish-api', stockfishRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
