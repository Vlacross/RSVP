require('dotenv').config(); /*https://www.npmjs.com/package/dotenv */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/RSVP'
const MONGODB_URI_TEST = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/RSVP-test'

const PORT = process.env.PORT || 8080

const JWT_SECRET = process.env.SECRET || 'w3llb0ws'

const ALG = process.env.ALGORITHM || 'HS256'

module.exports = { MONGODB_URI, MONGODB_URI_TEST, JWT_SECRET, ALG, PORT }