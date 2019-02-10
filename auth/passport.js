const passport = require('passport')
const JWT = require('jsonwebtoken')

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models')
const {JWT_SECRET, ALG } = require('../config')

/* check for valid jwt ? redirect to app.home : redirect to login(flash msg)*/

var opt = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),/*List of JWT extractors - http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request */
    algorithms: ALG
};

const tokenStrat = new JwtStrategy(opt, function(jwt_payload, done) {
    console.log('made first strat-step')
    User.findOne({username: jwt_payload.username}, function(err, usr) {
        console.log('made second strat-step')
        if(err) {return done(err, false)};
        if(usr) {return done(null, user)}
        else {
            
            return done(null, false)
        };
    });
});

/*validate credentials */

const localStrat = new LocalStrategy(
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

module.exports = { tokenStrat, localStrat }
