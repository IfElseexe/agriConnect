import mongoose from 'mongoose';

const chatRoomSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      text: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: { type: Date },
    },
  },
  { timestamps: true }
);

chatRoomSchema.index({ participants: 1 }, { unique: false });

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
export default ChatRoom;
