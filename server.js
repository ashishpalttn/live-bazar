const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const { query_input } = req.query;
  res.json({ message: `Hello from Lambda! root endpoint ${query_input}` });
});

app.get("/home-page", (req, res) => {
  const { query_input } = req.query;
  res.json({ message: `Hello from Lambda Home page! ${query_input}` });
});

module.exports = app;
