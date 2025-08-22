// src/controllers/gamification.controller.js
import Progress from "../models/Progress.js";
import Badge from "../models/Badge.js";
import { getLeaderboard } from "../services/leaderboard.service.js";

// Update streak
export const updateStreak = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let progress = await Progress.findOne({ user: userId });

    if (!progress) {
      progress = await Progress.create({ user: userId });
    }

    const today = new Date().toDateString();
    const lastActive = progress.lastActive ? progress.lastActive.toDateString() : null;

    if (lastActive !== today) {
      // check if yesterday -> streak continues
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActive === yesterday.toDateString()) {
        progress.streak += 1;
      } else {
        progress.streak = 1; // reset streak
      }
      progress.lastActive = new Date();
      progress.points += 10; // reward points for daily login
      await progress.save();
    }

    res.json({ streak: progress.streak, points: progress.points });
  } catch (error) {
    next(error);
  }
};

// ✅ Assign badge manually or by condition
export const assignBadge = async (req, res, next) => {
  try {
    const { badgeId } = req.body;
    const userId = req.user._id;

    const badge = await Badge.findById(badgeId);
    if (!badge) return res.status(404).json({ message: "Badge not found" });

    const progress = await Progress.findOneAndUpdate(
      { user: userId },
      { $addToSet: { badges: badge._id } },
      { new: true }
    ).populate("badges");

    res.json({ message: "Badge assigned!", progress });
  } catch (error) {
    next(error);
  }
};

// ✅ Get leaderboard
export const leaderboard = async (req, res, next) => {
  try {
    const data = await getLeaderboard(10);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
