import express from 'express';
import { getUserChatRooms, getOrCreateChatRoom } from '../controllers/chatRoom.controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, getUserChatRooms);
router.post('/', authenticateUser, getOrCreateChatRoom);

export default router;
