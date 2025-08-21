// src/services/leaderboard.service.js
import Progress from "../models/Progress.js";
import User from "../models/User.js";

export const getLeaderboard = async (limit = 10) => {
  return await Progress.find()
    .sort({ points: -1, streak: -1 })
    .limit(limit)
    .populate("user", "username email");
};
