const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/RSVP'

const JWT_SECRET = process.env.SECRET || 'w3llb0ws'

module.exports = { MONGODB_UR, JWT_SECRET }