import express from 'express';
import { createCheckout, verifyPayment } from '../controllers/checkoutController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, createCheckout);
router.post('/verify', auth, verifyPayment);

export default router;