const bodyParser =  require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');

const config  = require('../config');
const response = require('./response');

const app = express();
const server = http.createServer(app);
const io = socketIO(3001);
const chat = io.of('/ws');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const Message = require('./models/message.ts');
const Chatroom = require('./models/chatroom.ts');

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
    if(err) {
      res.send(response.failure(err));
    }
    chat.emit('message', msg);
    res.send(response.success(msg));
  })
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
  let body = req.body;
  
  if (body.author) {
    body.participants = [body.author];
  }
  console.log('/chatrooms:post', body);

  Chatroom.findOne({ name: body.name },(err, chatroom)=> {
    console.log('chatroom', chatroom);

    if (!chatroom) {
      let newChatroom = new Chatroom(body);

      newChatroom.save((err) => {
        if (err) {
          return res.send(response.failure(err));
        }

        return sendMessage({
          chatroom: newChatroom._id,
          ...config.welcomeMessage
        }, res);
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
  chat,
};
