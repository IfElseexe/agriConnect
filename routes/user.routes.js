import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Future middleware for admin check (optional)
// const isAdmin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') return next();
//   return res.status(403).json({ message: 'Unauthorized access' });
// };

// ✅ GET all users (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Hide sensitive info
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
