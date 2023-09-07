// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stockfishRoutes = require('./routes/stockfishRoutes');

const app = express();
const port = 3000; // Choose an available port

app.use(bodyParser.json());
app.use(cors());

// Define routes
app.use('/stockfish-api', stockfishRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
