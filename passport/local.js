const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models')


const localStrategy = new LocalStrategy(
  function(userName, passWord, done) {
      User.findOne({username: userName}, function(err, user) {
          if(err) {return done(err, false)};
          if(!user) {return done(null, false)}
          if(!user.verifyPassword(passWord)) {
              return done(null, false)
          } else {
              return done(null, user)
          }
      });
  }
);

module.exports = localStrategy