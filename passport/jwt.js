const passport = require('passport');
const JWT = require('jsonwebtoken');

const { Strategy: JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');


const { User } = require('../models');
const { JWT_SECRET, ALG } = require('../config');


var opt = {
	secretOrKey: JWT_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),/*List of JWT extractors - http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request */
	algorithms: ALG
};

const jwtStrategy = new JwtStrategy(opt, function (jwt_payload, done) {

	User.findOne({ username: jwt_payload.user }, function (err, usr) {
		if (err) { return done(err, false) };
		if (usr) { return done(null, usr) }
		else {
			return done(null, false)
		};
	});
});



module.exports = jwtStrategy

