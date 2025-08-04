import express from 'express';
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from '../controllers/message.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js'; // ✅ named import

const router = express.Router();

router.get('/:roomId', authenticateUser, getMessages);
router.post('/', authenticateUser, sendMessage);
router.delete('/:messageId', authenticateUser, deleteMessage);

export default router;
