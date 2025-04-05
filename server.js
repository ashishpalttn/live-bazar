const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: `Hello from Lambda! root end point` });
});

app.get('/home-page', (req, res) => {
  res.json({ message: `Hello from Lambda Home page !` });
});

module.exports = app; 
