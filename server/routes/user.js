const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// --- AUTH MIDDLEWARE ---
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
      if (!req.user) return res.status(401).json({ message: 'User not found' });
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) res.status(401).json({ message: 'No token' });
};

// --- ROUTES ---

// 1. SIGNUP (Email + Password)
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      email,
      username,
      password: hashedPassword,
      likedSongs: [],
      recentlyPlayed: []
    });

    await user.save();
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN (Email + Password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. REQUEST MAGIC LINK (Recovery)
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.magicToken = token;
    user.magicTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;

    console.log('\n----------------------------------------');
    console.log('RECOVERY LINK REQUESTED FOR:', email);
    console.log('URL:', link);
    console.log('----------------------------------------\n');

    if (process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: process.env.SMTP_PORT,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      await transporter.sendMail({
        from: '"A&I Music" <noreply@aimusic.com>',
        to: email,
        subject: 'Reset your A&I Music Access',
        html: `<h1>Magic Login Link</h1><p>Click below to log in instantly.</p><a href="${link}">Log In</a>`
      });
    }

    res.json({ message: 'Magic link sent to your email (and console)!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. VERIFY MAGIC LINK
router.post('/verify-magic', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ magicToken: token, magicTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Link invalid or expired' });

    user.magicToken = null;
    user.magicTokenExpiry = null;
    await user.save();

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: authToken, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE PROFILE (Protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, gender } = req.body;
    if (username) req.user.username = username;
    if (gender) req.user.gender = gender;
    
    await req.user.save();
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        gender: req.user.gender,
        likedSongs: req.user.likedSongs,
        recentlyPlayed: req.user.recentlyPlayed
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. GET USER DATA (Protected)
router.get('/', protect, async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      email: req.user.email,
      username: req.user.username,
      gender: req.user.gender,
      likedSongs: req.user.likedSongs,
      recentlyPlayed: req.user.recentlyPlayed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. UPDATE LIKES (Protected)
router.post('/likes', protect, async (req, res) => {
  try {
    req.user.likedSongs = req.body.likedSongs;
    await req.user.save();
    res.json({ likedSongs: req.user.likedSongs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. UPDATE RECENT (Protected)
router.post('/recent', protect, async (req, res) => {
  try {
    req.user.recentlyPlayed = req.body.recentlyPlayed;
    await req.user.save();
    res.json({ recentlyPlayed: req.user.recentlyPlayed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
