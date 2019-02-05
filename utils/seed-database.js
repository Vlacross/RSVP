const mongoose = require('mongoose')


const { MONGODB_URI } = require('../config');

const Post = require('../models/posts');
const User = require('../models/users');

const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
.then(() => {
  console.info('Dropping Database');
  return mongoose.connection.db.dropDatabase();
})
.then(() =>{
  console.log('Seeding database')
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
  });