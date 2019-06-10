const mongoose = require('mongoose');
const mongooseController = require('../src/controllers/mongoose');

beforeAll(async () => {
  await mongooseController.init(() => {});
});


afterAll(async (done) => {
  await mongoose.disconnect(done);
});
