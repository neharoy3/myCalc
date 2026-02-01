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

    const { expression, result } = req.body;

    if (!expression || !result) {
        return res.status(400).send("Invalid data");
    }

    try {
        const entry = new History({ expression, result });
        await entry.save();

        res.send("Saved to DB");

    } catch (err) {
        res.status(500).send("DB save error");
    }
});


//get history
app.get("/history", async (req, res) => {

    try {
        const history = await History
            .find()
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