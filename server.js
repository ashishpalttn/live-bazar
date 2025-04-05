const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const {query_input} = req.query
  res.json({ message: `Hello from Lambda! root end point ${query_input}` });
});

app.get("/home-page", (req, res) => {
  const {query_input} = req.query
  res.json({ message: `Hello from Lambda Home page! ${query_input}` });
});

// Run server only when executed directly (not in Lambda)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
