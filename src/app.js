const bodyParser =  require('body-parser');
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

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connect(config.mongo.uri, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err);

    throw new Error(err.message);
  }
  console.log('mongodb connected');
});

const sendMessage = (msg, res) => {
  console.log('sendMessage', msg);
  let message = new Message(msg);

  message.save((err) => {
    if (err) {
      return res.send(response.failure(err));
    }

    io.emit('message', msg);
    res.send(response.success(msg));
  })
}

const sendWelcomeMessage = (chatroom, res) => {
  console.log('sendWelcomeMessage for', chatroom);
  sendMessage({
    chatroom,
    ...config.welcomeMessage
  }, res)
}

app.get(`/${config.name}`, function (req, res) {
  res.sendFile('index.html' , { root : __dirname});
})

app.get(`/${config.name}/messages`, (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.get(`/${config.name}/messages/:chatroom`, (req, res) => {
  const chatroom = req.params.chatroom

  Message.find({chatroom},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.post(`/${config.name}/chatrooms`, (req, res) => {
  console.log('/chatrooms:post', req.body);
  if (!req || !req.body) {
    console.warn('Invalid request!');

    return false;
  }
  let { body } = req;

  if (body.author) {
    body.participants = [body.author];
  }

  console.log('/chatrooms:post', body);

  Chatroom.findOne({ name: body.name },(err, chatroom)=> {
    console.log('chatroom', chatroom);

    if (!chatroom) {
      let newChatroom = new Chatroom(body);

      newChatroom.save((err) => {
        if(err) {
          res.send(response.failure(err));
        } else {
          sendWelcomeMessage(newChatroom._id, res)
        }
      });
    } else {
      res.send(response.success(chatroom));
    }   
  });
});

app.post(`/${config.name}/messages`, (req, res) => {
  console.log('/messages:post', req.body);
  sendMessage(req.body, res);
});

module.exports = {
  app,
  server,
  io,
};
