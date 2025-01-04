import * as userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, dateOfBirth, phoneNumber } = req.body;

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await userModel.createUser(name, email, password, dateOfBirth, phoneNumber);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.accountInfo.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.accountInfo.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Logged in successfully',
      user: { id: user.id, name: user.name, email: user.accountInfo.email },
      userId: user.id  // Add this line to include the user ID in the response
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // For now, we'll just send a success message
    // In the future, you might want to implement token invalidation or other logout logic
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

