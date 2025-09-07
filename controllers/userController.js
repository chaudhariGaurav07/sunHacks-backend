import User from '../models/User.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, age, educationLevel, learningStyle } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, age, educationLevel, learningStyle },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeOnboarding = async (req, res) => {
  try {
    const { age, educationLevel, learningStyle } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        age, 
        educationLevel, 
        learningStyle, 
        isOnboarded: true 
      },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};