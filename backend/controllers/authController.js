const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Register user
const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            message: 'User registered successfully',
            user: userObj
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};


// Generate JWT token
/* const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}; */
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};


// Login user
/* const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    //const token = generateToken(user._id);
    const token = generateToken(user);

    // Remove password before sending
    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      message: 'Login successful',
      token,
      user: userObject
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}; */
// Login user - SIMPLIFIED WORKING VERSION
const login = async (req, res) => {
    try {
        console.log('Login attempt for:', req.body.email);

        const { email, password } = req.body;

        // Simple email trim and lowercase
        const cleanEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({ email: cleanEmail });

        if (!user) {
            console.log('User not found:', cleanEmail);
            return res.status(401).json({ error: 'User not found' });
        }

        // DEBUG
        console.log('User found:', user.email);
        console.log('Comparing password...');

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        console.log('Password match:', match);

        if (!match) {
            return res.status(401).json({ error: 'Wrong password' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        };

        console.log('Login successful for:', user.email);

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed: ' + error.message });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    try {
        //const token = generateToken(req.user.userId);
        const user = await User.findById(req.user.userId);
        const token = generateToken(user);

        res.json({
            message: 'Token refreshed',
            token
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Token refresh failed' });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(
            req.user.userId,
            'name email role state createdAt updatedAt'
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { name, email } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            updateData,
            {
                new: true,
                fields: 'name email role state createdAt updatedAt'
            }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email  already exists' });
        }

        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors.array()
            });
        }

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidCurrentPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    getProfile,
    updateProfile,
    changePassword
};