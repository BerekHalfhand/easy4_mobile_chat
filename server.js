var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

const dbUrl = 'mongodb://127.0.0.1:27017/mobile-chat';

mongoose.connect(dbUrl ,(err) => {
  console.log('mongodb connected',err);
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
  var user = req.params.user
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


var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});
