const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../users')


const localStrategy = new LocalStrategy(
  function(userName, passWord, done) {
      console.log(passWord)
      User.findOne({username: userName}, function(err, user) {
          if(err) {return done(err, false)};
          if(!user) {return done(null, false)}
          if(!user.comparePassword(passWord)) {
              return done(null, false)
          } else {console.log('pass passed')
              return done(null, user)
          }
      });
  }
);

module.exports = localStrategy