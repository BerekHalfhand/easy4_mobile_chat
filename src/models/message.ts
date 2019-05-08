const mongoose = require('mongoose');
const config = require('../../config');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  message: {
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
