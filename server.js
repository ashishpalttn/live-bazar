const express = require('express');
const app = express();

app.use(express.json());
console.log("✅ This is the updated Lambda version deployed at", new Date().toISOString());
app.get("/", (req, res) => {
  res.json({ message: "Hello from Lambda modified_4!" });
});
// Run server only when executed directly (not in Lambda)
// Run server only when executed directly (not in Lambda)
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
