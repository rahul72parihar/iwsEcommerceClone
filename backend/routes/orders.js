import express from 'express';
import { getMyOrders } from '../controllers/orderController.js';
import { getOrderById } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/myorders', auth, getMyOrders);
router.get('/myorders/:id', auth, getOrderById);

export default router;