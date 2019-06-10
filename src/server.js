const config = require('../config');
const { app, server, io } = require('./app');

const PORT = config.http.port || 3000;

io.on('connection', (socket) => {
  console.log('a user is connected on', socket.id);
  io.emit('ready');
});

server.listen(PORT, () => {
  console.log('server is running on port', PORT);
  console.log('environment', process.env.NODE_ENV);
});
