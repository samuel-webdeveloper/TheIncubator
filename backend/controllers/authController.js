import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Utility: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    // Instead of generating a new token, we tell the client to log out
    res.status(200).json({
      message: 'Password changed successfully. Please log in again.',
      logout: true, // indicate logout needed
    });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allowedFields = [
      'name', 'bio', 'skills', 'address', 'experience',
      'specialty', 'goals', 'gender', 'dob', 'phone',
      'location', 'fee'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    user.profileComplete = true;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      address: updatedUser.address,
      specialty: updatedUser.specialty,
      experience: updatedUser.experience,
      fee: updatedUser.fee,
      profileComplete: updatedUser.profileComplete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all mentees (for mentors to send requests)
export const getAllMentees = async (req, res) => {
  try {
    const mentees = await User.find({ role: 'mentee' }).select('-password');
    res.status(200).json(mentees);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
