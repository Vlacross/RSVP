const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models')


const localStrategy = new LocalStrategy(
	function (userName, passWord, done) {
		let user;
		User.findOne({ username: userName })
		.then(_user => {
			user = _user
			if(!user) {
				return Promise.reject({message: 'Invalid username!', reason: 'loginFail'})
			}
			return user.checkPass(passWord)
		})
		.then(valid => {
			if(!valid) {
				return Promise.reject({message: 'Invalid Password!', reason: 'loginFail'})
			}
			done(null, user)
		})
		.catch(err =>{
			
			if(err.reason === 'loginFail') {
				return done(null, false, err)
			}
			return done(err, false)
		})


	}
);



module.exports = localStrategy
 