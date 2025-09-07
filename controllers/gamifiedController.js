import User from '../models/User.js';
import Badge from '../models/Badge.js';

export const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const today = new Date();
    const lastActivity = new Date(user.streak.lastActivity);
    
    // Check if it's a new day
    if (today.toDateString() !== lastActivity.toDateString()) {
      const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - increase streak
        user.streak.count += 1;
      } else {
        // Streak broken - reset to 1
        user.streak.count = 1;
      }
      
      user.streak.lastActivity = today;
      await user.save();
    }

    res.json({
      success: true,
      streak: user.streak.count,
      message: 'Streak updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignBadge = async (req, res) => {
  try {
    const { badgeId } = req.body;
    const user = await User.findById(req.user.id);

    // Check if user already has this badge
    const hasBadge = user.badges.some(badge => 
      badge.badgeId.toString() === badgeId
    );

    if (hasBadge) {
      return res.status(400).json({ message: 'Badge already earned' });
    }

    const badge = await Badge.findById(badgeId);
    if (!badge) {
      return res.status(404).json({ message: 'Badge not found' });
    }

    user.badges.push({ badgeId });
    user.totalPoints += badge.points;
    await user.save();

    res.json({
      success: true,
      message: 'Badge earned successfully',
      badge
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find()
      .select('name totalPoints streak.count')
      .sort({ totalPoints: -1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.totalPoints,
      streak: user.streak.count
    }));

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};