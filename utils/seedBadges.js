import Badge from '../models/Badge.js';

const defaultBadges = [
  {
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "trophy",
    criteria: "Complete 1 quiz",
    points: 10,
    rarity: "common"
  },
  {
    name: "Study Streak",
    description: "Maintain a 7-day study streak",
    icon: "flame",
    criteria: "7 consecutive days of activity",
    points: 25,
    rarity: "rare"
  },
  {
    name: "Quiz Master",
    description: "Score 100% on 5 quizzes",
    icon: "star",
    criteria: "Perfect scores on 5 quizzes",
    points: 50,
    rarity: "epic"
  },
  {
    name: "Study Legend",
    description: "Reach 1000 total points",
    icon: "crown",
    criteria: "Accumulate 1000 points",
    points: 100,
    rarity: "legendary"
  }
];

export const seedBadges = async () => {
  try {
    const existingBadges = await Badge.countDocuments();
    if (existingBadges === 0) {
      await Badge.insertMany(defaultBadges);
      console.log('✅ Default badges seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
  }
};