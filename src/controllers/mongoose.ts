import mongoose from 'mongoose';
import config from '../../config';

export const init = (onDisconnectedFunc: any) => {
  mongoose.connect(config.mongo.uri, { useNewUrlParser: true });
  console.log('mongoose initialized');

  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useNewUrlParser', true);

  [mongoose.connection].forEach((connection) => {
    console.log('connection established');
    if (onDisconnectedFunc) connection.on('disconnected', onDisconnectedFunc);
  });

  return mongoose.connection;
};
