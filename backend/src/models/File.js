const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  sha256: { type: String, required: true, unique: true },
  occurrenceCount: { type: Number, default: 1 },
  path: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
