const request = require('supertest');
const app = require('../src/app');
const configTest = require('../config');

describe('Test the root path', () => {
  test('It should response the GET method', () => {
    return request(app).get(`/${configTest.name}`).expect(200);
  });
});
