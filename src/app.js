const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const config  = require('../config');
const response = require('./response');

const Message = require('./models/message.js');
const Chatroom = require('./models/chatroom.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  transports: ['websocket'],
  path: '/mobile-chat/ws',
});

const router = require('./router')(io);

app.use(`/${config.name}`, router);
app.use(express.static(__dirname));

mongoose.connect(config.mongo.uri, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);

    throw new Error(err.message);
  }
  console.log('mongodb connected');
});

module.exports = {
  app,
  server,
  io,
};
