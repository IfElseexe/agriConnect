import express from 'express';
import { getProductOptions } from '../controllers/productOptionsController.js';

const router = express.Router();

router.get('/', getProductOptions);

export default router;
