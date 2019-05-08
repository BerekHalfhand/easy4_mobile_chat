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

io.on('connection', () =>{
  console.log('a user is connected')
});

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})


app.get('/messages/:user', (req, res) => {
  const user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})


app.post('/messages', (req, res) => {
  let message = new Message(req.body);
  message.save((err) => {
    console.log('/messages:post');
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
});


const server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
  console.log('environment', process.env.NODE_ENV);
});
