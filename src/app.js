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

const sendMessage = (msg, unresolve = false) => {
  console.log('sendMessage', msg);
  if (unresolve) {
    Chatroom.findOne({ name: msg.chatroom },(err, chatroom)=> {
      console.log('unresolving chatroom', chatroom);
      if (!chatroom) return false;

      chatroom.resolved = false;
      chatroom.save((err) => {
        if(err) {
          return response.failure(err);
        }
      })
    });
  }

  let message = new Message(msg);

  message.save((err) => {
    if (err) {
      return response.failure(err);
    }

    io.emit('message', message);
    return response.success(message);
  })
}

const sendWelcomeMessage = (chatroom) => {
  console.log('sendWelcomeMessage for', chatroom);
  return sendMessage({
    chatroom,
    ...config.welcomeMessage
  })
}

// GET

app.get(`/${config.name}`, function (req, res) {
  res.sendFile('index.html' , { root : __dirname});
})

app.get(`/${config.name}/messages`, (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.get(`/${config.name}/messages/:chatroom`, (req, res) => {
  const chatroom = req.params.chatroom;
  console.log('Looking for chatroom', chatroom);

  Message.find({chatroom},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.get(`/${config.name}/chatrooms/unresolved`, (req, res) => {
  console.log('Looking for unresolved chatrooms');

  Chatroom.find({resolved: false},(err, chatrooms)=> {
    res.send(response.success(chatrooms));
  })
})

// POST

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
          console.log('newChatroom', newChatroom);
          sendWelcomeMessage(newChatroom.name);
          res.send(response.success(newChatroom))
        }
      });
    } else {
      res.send(response.success(chatroom));
    }
  });
});

app.post(`/${config.name}/messages`, (req, res) => {
  console.log('/messages:post', req.body);
  res.send(sendMessage(req.body, true));
});

app.post(`/${config.name}/chatrooms/unresolved`, (req, res) => {
  console.log('/chatrooms/unresolved:post', req.body);
  let { body } = req;

  Chatroom.findOne({name: body.chatroom},(err, chatroom)=> {
    console.log('chatroom', chatroom);
    if (!chatroom) res.send(response.failure('Chatroom not found'));

    chatroom.resolved = true;
    chatroom.save((err) => {
      if(err) {
        res.send(response.failure(err));
      } else {
        res.send(response.success(chatroom));
      }
    })

  })
})

module.exports = {
  app,
  server,
  io,
};
