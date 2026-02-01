const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    sessionId: String,
    expression: String,
    result: String
  },
  { timestamps: true }   // ← THIS IS IMPORTANT
);

module.exports = mongoose.model("History", historySchema);
