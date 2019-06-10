const mongoose = require('mongoose');
const config = require('../../config');

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  resolved: {
    type: Boolean,
    default: true,
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
