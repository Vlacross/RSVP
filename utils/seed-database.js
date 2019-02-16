const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


const { MONGODB_URI } = require('../config');


const Post = require('../posts/postsModel');
const User = require('../users/usersModel');
const Comments = require('../comments/commentsModel');

const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');


mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
.then(() => {
  console.info('Dropping Database');
  return mongoose.connection.db.dropDatabase();
})
.then(() => {
  return Promise.all(seedUsers.map( user => bcrypt.hash(user.password, 10)));
})
.then((digests) =>{
  seedUsers.forEach((user, i) => user.password = digests[i]);
  console.log('Seeding database')
    return Promise.all([
      Post.insertMany(seedPosts),
      User.insertMany(seedUsers),
      Comments.insertMany(seedComments),
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