import ChatRoom from '../models/ChatRoom.js';
import Message from '../models/Message.js';

export const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user._id;

    const rooms = await ChatRoom.find({ participants: userId })
      .populate('participants', 'name email role')
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get chat rooms', error: err });
  }
};

export const getOrCreateChatRoom = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const userId = req.user._id;

    let room = await ChatRoom.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!room) {
      room = await ChatRoom.create({
        participants: [userId, otherUserId],
      });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get/create chat room', error: err });
  }
};
