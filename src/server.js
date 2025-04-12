const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: `Hello from Lambda! root end point` });
});

app.get('/home-page', (req, res) => {
  res.json({ message: `Hello from Lambda Home page !` });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🟢 Listening on port ${PORT}`));
}

module.exports = app; 
