const success = (payload) => ({
  statusCode: 200,
  result: payload
});

const failure = (errors) => ({
  statusCode: 500,
  ...errors
});

module.exports = {
  success,
  failure,
};
