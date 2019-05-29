const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

const config = require('../config');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

const Message  = require('./models/message.ts');

mongoose.connect(config.mongo.uri, { useNewUrlParser: true }, (err) => {
  console.log('mongodb connected',config);
});

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  const user = req.params.user
  Message.find({author: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', (req, res) => {
  let message = new Message(req.body);
  message.save((err) => {
    if(err)
      sendStatus(500);

    console.log('/messages:post', message);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
});

module.exports = app;
