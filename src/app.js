const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

const config = require('../config');
const response = require('./response');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const Message  = require('./models/message.ts');

mongoose.connect(config.mongo.uri, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected',config);
});

app.get(`/${config.name}`, function (req, res) {
  res.sendFile('index.html' , { root : __dirname});
})

app.get(`/${config.name}/messages`, (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.get(`/${config.name}/messages/:user`, (req, res) => {
  const user = req.params.user
  Message.find({author: user},(err, messages)=> {
    res.send(response.success(messages));
  })
})

app.post(`/${config.name}/messages`, (req, res) => {
  let message = new Message(req.body);
  message.save((err) => {
    console.log('/messages:post');
    if(err)
      res.send(response.failure(err));
    io.emit('message', req.body);
    res.send(response.success(req.body));
  })
});

module.exports = app;
