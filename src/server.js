const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', () =>{
  console.log('a user is connected')
});

const server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
  console.log('environment', process.env.NODE_ENV);
});
