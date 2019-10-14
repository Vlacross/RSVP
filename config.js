require('dotenv').config(); /*https://www.npmjs.com/package/dotenv */

const MONGODB_URI = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/RSVP' : process.env.MONGODB_URI;'mongodb://localhost:27017/RSVP-test'
const MONGODB_URI_TEST = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/RSVP-test' : process.env.MONGODB_URI_TEST; 

const PORT = process.env.PORT || 8080

const JWT_SECRET = process.env.SECRET || 'w3llb0ws'

const ALG = process.env.ALGORITHM || 'HS256'

const EXP = process.env.EXPIRES_IN || '10h'

module.exports = { MONGODB_URI, MONGODB_URI_TEST, JWT_SECRET, ALG, EXP, PORT }