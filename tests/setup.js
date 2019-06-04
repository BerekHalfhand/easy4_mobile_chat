const mongoose = require('mongoose');
const mongooseController = require('../src/controllers/mongoose');
// const rabbitController = require('./../src/controllers/rabbit');
// const { rpcHandler } = require('./../src/handlers/rpc');

beforeAll(async () => {
  await mongooseController.init(() => {});
  // await rabbitController.init(rpcHandler);
  // await Promise.delay(3000);
});


afterAll(async (done) => {
  await mongoose.disconnect(done);
});
