const connectDB = require("./db");
const History = require("./models/history");

const express = require("express");
const cors = require("cors");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

//temp history storage
// let history = [];

//history
app.post("/history/:sessionId", async (req, res) => {
  const { expression, result } = req.body;
  const { sessionId } = req.params;

  if (!expression || !result || !sessionId) {
    return res.status(400).send("Invalid data");
  }

  try {
    const entry = new History({
      sessionId,
      expression,
      result
    });

    await entry.save();
    res.send("Saved to DB");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB save error");
  }
});

app.get("/history/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const history = await History.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB fetch error");
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});