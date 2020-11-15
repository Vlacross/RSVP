const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_URI_TEST } = require('../config');

const jwt = require('jsonwebtoken')
const { JWT_SECRET, ALG, EXP } = require('../config');

const { User, EventPlan, Post, Comment } = require('../models');
const { seedEvents, seedPosts, seedUsers, seedComments} = require('../db');




function connectDatabase() {
    return mongoose.connect(
      MONGODB_URI_TEST, 
      { 
        useUnifiedTopology: true, 
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true, 
        autoIndex: false 
      })
      .then((conn) => {
        return conn;
      }, (err) => {
        if (err) {
          throw(err)
        }
    })
    .catch(err => console.log(err))
};

async function disconnectDatabase() {
  console.log("Disconnecting...")
  return await mongoose.disconnect()
    .then(() => {
      console.log("             ... done!")
    })
		.catch(err => console.log(err))
};

async function seedDatabase(db) {
  await db.dropDatabase()
  return Promise.all(seedUsers.map(user => bcrypt.hash(user.password, 10)))
        .then((digests) => {
          seedUsers.forEach((user, i) => user.password = digests[i]);
          console.log('Seeding database')
          return Promise.all([
            Post.insertMany(seedPosts),
            User.insertMany(seedUsers),
            Comment.insertMany(seedComments),
            EventPlan.insertMany(seedEvents)
          ]);
        })
        .catch(err => {
          console.error(`ERROR: ${err.message}`);
          console.error(err);
          });
}

function buildToken(user) {

  const opts = {
    algorithm: ALG,
    expiresIn: EXP
  };


  return jwt.sign({ user }, JWT_SECRET, opts);
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  seedDatabase,
  buildToken
}
