import express from 'express';
import {
  register,
  login,
  getMe,
  getProfile,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', getMe);
router.get('/profile', getProfile);

export default router;

