const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true
    },
    expression: String,
    result: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("History", historySchema);
