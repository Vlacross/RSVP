const passport = require('passport')
const JWT = require('jsonwebtoken')

const { Strategy: JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');


const { User } = require('../models')
const { JWT_SECRET, ALG } = require('../config')




/* check for valid jwt ? redirect to app.home : redirect to login(flash msg)*/

var opt = {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),/*List of JWT extractors - http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request */
    algorithms: ALG
};

const jwtStrategy = new JwtStrategy(opt, function(jwt_payload, done) {
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

module.exports = jwtStrategy
