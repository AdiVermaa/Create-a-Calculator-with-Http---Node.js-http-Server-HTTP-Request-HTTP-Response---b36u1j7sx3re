const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/calculate') {
    const inputFile = path.join(__dirname, 'inputs.txt');
    const outputFile = path.join(__dirname, 'result.txt');

    fs.readFile(inputFile, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Unable to write result');
        return;
      }

      const lines = data.trim().split('\n');
      if (lines.length < 3) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid Input File');
        return;
      }

      const num1 = parseFloat(lines[0]);
      const num2 = parseFloat(lines[1]);
      const operator = lines[2].trim().toLowerCase();

      if (isNaN(num1) || isNaN(num2)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid Number');
        return;
      }

      let result;
      switch (operator) {
        case 'add':
          result = num1 + num2;
          break;
        case 'subtract':
          result = num1 - num2;
          break;
        case 'multiply':
          result = num1 * num2;
          break;
        case 'divide':
          if (num2 === 0) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Division by zero');
            return;
          }
          result = num1 / num2;
          break;
        default:
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid Operator');
          return;
      }

      fs.writeFile(outputFile, result.toString(), (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Unable to write result');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(result.toString());
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports = server;