const mongoose = require('mongoose')


const { MONGODB_URI } = require('../config');

const Post = require('../models/post');
const User = require('../models/user');

const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');


console.info('Connecting to:', MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      Post.insertMany(seedPosts),
      User.insertMany(seedUsers),
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });;