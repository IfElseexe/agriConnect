import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';

export const getMessages = async (req, res) => {
  try {
    const { chatRoomId } = req.params;

    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate('sender', 'name role')
      .populate('receiver', 'name role')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get messages', error: err });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, receiverId, message, type, attachmentUrl } = req.body;

    const newMessage = await Message.create({
      chatRoom: chatRoomId,
      sender: req.user._id,
      receiver: receiverId,
      message,
      type,
      attachmentUrl,
    });

    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      lastMessage: {
        text: message,
        sender: req.user._id,
        timestamp: new Date(),
      },
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const deleted = await Message.findByIdAndDelete(messageId);

    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message', error: err });
  }
};
