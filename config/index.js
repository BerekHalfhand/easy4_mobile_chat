const fs = require('fs');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

let config = require('dotenv');

if (fs.existsSync(envFile)) {
  config = config.config({ path: envFile });
} else {
  config.config();
}

if (config.error) {
  throw config.error;
};

const SERVICE_NAME = 'mobile-chat';

module.exports = {
  id: `${SERVICE_NAME}-service`,
  name: SERVICE_NAME,
  env: process.env.NODE_ENV,
  http: {
    port: parseInt(process.env.REST_PORT, 10) || 3000,
  },
  mongo: {
    collectionPrefix: process.env.MONGO_COLLECTION_PREFIX || `${SERVICE_NAME}-service-`,
    uri: process.env.MONGO_URI
    || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION_NAME}`
    || 'mongodb://localhost:27017/data',
  },
  welcomeMessage: {
    author: 'chatbot',
    body: 'Добро пожаловать в Easy4'
  }
};

