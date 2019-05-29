const mongoose = require('mongoose');
const config = require('../../config');

const messageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },

  chatroom: {
    type: String,
    required: false,
  },

  body: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MessageModel = mongoose.model(
  `${config.mongo.collectionPrefix}Message`,
  messageSchema,
);

module.exports = MessageModel;
