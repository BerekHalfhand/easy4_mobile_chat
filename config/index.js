import fs from 'fs';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

let config = require('dotenv');

if (fs.existsSync(envFile)) {
  console.log(envFile, 'exists');
  config = config.config({ path: envFile });
} else config.config();

if (config.error) {
  throw config.error;
};

const SERVICE_NAME = 'mobile-chat';

console.log(process.env.MONGO_COLLECTION_PREFIX);

export default {
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
  }
};
// export const rabbit = {
//   url: process.env.RABBIT_URI || 'amqp://localhost:5672',
//
//   profileServiceRPC:
//     process.env.RABBIT_PROFILE_SERVICE_RPC || `${SERVICE_NAME}-service-rpc`,
//   authServiceRPC: process.env.RABBIT_AUTH_SERVICE_RPC || 'b2c-auth-service-rpc',
//
//   replyToChannel:
//     process.env.RABBIT_REPLY_TO || `${SERVICE_NAME}-service-reply-to-`,
//
//   emailsQueue: process.env.EMAILS_QUEUE || 'emails-queue',
//
//   bitrix24: process.env.BITRIX_24_QUEUE || 'bitrix-24-queue',
//
//   secret: process.env.RABBIT_SECRET || 'd41d8cd98f00b204e9800998ecf8427e',
// };
//
// export const http = {
//   port: httpPort,
// };
//
// export const email = {
//   confirmExpires: process.env.EMAIL_CONFIRM_EXPIRES || 5184000000,
//   confirmLinkPattern:
//     process.env.EMAIL_CONFIRM_LINK_PATTERN ||
//     `http://localhost:${httpPort}/emails/confirm/:code`,
//   retryCount: 3,
// };
//
// export const mongo = {
//   collectionPrefix:
//     process.env.MONGO_COLLECTION_PREFIX || `${SERVICE_NAME}-service-`,
//   data: {
//     uri: process.env.MONGO_URI
//     || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION_NAME}`
//     || 'mongodb://localhost:27017/data',
//   },
// };
//
// export const log = {
//   namespace: process.env.LOG_NAMESPACE || `${SERVICE_NAME}-service`,
//   level: process.env.LOG_LEVEL || 'error',
// };
//
// export default {
//   id,
//   env: process.env.NODE_ENV,
//   rabbit,
//   http,
//   email,
//   mongo,
//   log,
// };
