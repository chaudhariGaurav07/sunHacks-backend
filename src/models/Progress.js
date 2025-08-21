// src/models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: null },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  points: { type: Number, default: 0 },
});

export default mongoose.model("Progress", progressSchema);
