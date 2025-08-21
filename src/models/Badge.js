// src/models/Badge.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String }, // URL to image/icon
  criteria: { type: String, required: true }, // e.g. "completed_5_guides"
});

export default mongoose.model("Badge", badgeSchema);
