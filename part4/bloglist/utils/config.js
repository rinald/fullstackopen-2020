require('dotenv').config()

const PORT = process.env.PORT
const AUTH = process.env.TEST_AUTH

let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

module.exports = {
  PORT,
  AUTH,
  MONGODB_URI,
}
