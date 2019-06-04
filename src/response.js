const success = (payload) => ({
  statusCode: 200,
  result: payload
})

const failure = (payload) => ({
  statusCode: 500,
  error: payload
})

module.exports = {success, failure};
