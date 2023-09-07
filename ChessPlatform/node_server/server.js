const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js Server!');
});

const port = 3000; // You can choose any available port
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
