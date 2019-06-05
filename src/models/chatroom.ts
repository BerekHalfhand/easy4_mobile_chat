import mongoose from 'mongoose';
import config from '../../config';

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  participants: {
    type: [String],
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatroomModel = mongoose.model(
  `${config.mongo.collectionPrefix}Chatroom`,
  chatroomSchema,
);

module.exports = ChatroomModel;
