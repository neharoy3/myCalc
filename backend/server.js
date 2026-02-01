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

//save calc
app.post("/save", async (req, res) => {

    const { sessionId, expression, result } = req.body;

    if (!sessionId || !expression || !result) {
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
        res.status(500).send("DB save error");
    }
});



//get history
app.get("/history/:sessionId", async (req, res) => {

    try {
        const { sessionId } = req.params;

        const history = await History
            .find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(history);

    } catch (err) {
        res.status(500).send("DB fetch error");
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});