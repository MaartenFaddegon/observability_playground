'use strict';

const express = require('express');

// Constants
const PORT = 8000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  console.log(`Handling a GET`);
  res.send('Hello World');
});

app.get('*', (req, res) => {
  console.log(`Handling a GET`);
  res.send('Hello Universe');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
