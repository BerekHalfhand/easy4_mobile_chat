import config from '../config';
import {app, server, io} from './app'

const PORT = config.http.port || 3000;

io.on('connection', (socket) =>{
  console.log('a user is connected on', socket.id)
});

server.listen(PORT, () => {
  console.log('server is running on port', PORT);
  console.log('environment', process.env.NODE_ENV);
});
