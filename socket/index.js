import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import ChatRoom from '../models/ChatRoom.js';

export default function setupSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id;
    console.log(`✅ User connected: ${userId}`);

    // Join personal room
    socket.join(`user:${userId}`);

    // ✅ Join a chat room
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`📥 User ${userId} joined room ${roomId}`);
    });

    // ✅ Send message
    socket.on('send-message', async (data) => {
      const { chatRoomId, receiverId, message, type = 'text', attachmentUrl } = data;

      try {
        const newMessage = await Message.create({
          chatRoom: chatRoomId,
          sender: userId,
          receiver: receiverId,
          message,
          type,
          attachmentUrl,
        });

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
          lastMessage: {
            text: type === 'text' ? message : `${type} sent`,
            sender: userId,
            timestamp: new Date(),
          },
        });

        // Broadcast to both sender and receiver
        io.to(`user:${userId}`).emit('receive-message', newMessage);
        io.to(`user:${receiverId}`).emit('receive-message', newMessage);
      } catch (err) {
        console.error('❌ Error sending message:', err);
        socket.emit('error', 'Message send failed');
      }
    });

    // ✅ Typing indicators
    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('typing', { userId });
    });

    socket.on('stop-typing', ({ roomId }) => {
      socket.to(roomId).emit('stop-typing', { userId });
    });

    // ✅ Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${userId}`);
    });
  });
}
