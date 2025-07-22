import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct,
  getApprovedProducts
} from '../controllers/productController.js';

import { authenticateUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/approved', getApprovedProducts);

// ✅ PUBLIC/SHARED ROUTES
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// ✅ FARMER ROUTES (Fixed image upload on product creation)
router.post('/', authenticateUser, upload.single('image'), createProduct); // ✅ upload added here
router.put('/:id', authenticateUser, updateProduct);
router.delete('/:id', authenticateUser, deleteProduct);

// ✅ ADMIN ROUTES
router.patch('/:id/approve', authenticateUser, isAdmin, approveProduct);
router.patch('/:id/reject', authenticateUser, isAdmin, rejectProduct);

// ✅ IMAGE UPLOAD ONLY (optional if you want a separate endpoint)
router.post('/upload', authenticateUser, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

export default router;
