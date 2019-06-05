export const success = (payload) => ({
  statusCode: 200,
  result: payload
})

export const failure = (errors) => ({
  statusCode: 500,
  ...errors
})

export default {success, failure};
