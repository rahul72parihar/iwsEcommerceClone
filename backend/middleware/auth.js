import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Auth header:', req.headers.authorization ? 'Present' : 'Missing');
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token');
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user ? user._id : 'NOT FOUND');

    if (!user) {
      console.log('User not found in DB');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    console.log('Auth success, req.user set:', req.user._id);
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
}
