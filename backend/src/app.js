const express = require("express");
const cors = require("cors");

const analyzeRoutes = require("./routes/analyze.routes");

const app = express();

app.use(cors({
  origin: "https://your-vercel-app.vercel.app"
}));
app.use(express.json());

app.use("/api", analyzeRoutes);

// app.get("/", (req, res) => {
//   res.send("Commit DNA Backend Running 🚀");
// });

module.exports = app;