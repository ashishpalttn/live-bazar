const express = require("express");
const app = express();

app.use(express.json());

app.get("/hello", (req, res) => {
  res.json({ message: "Hello from Lambda!" });
});
// Run server only when executed directly (not in Lambda)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
