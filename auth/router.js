const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const Router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const jwt = require('jsonwebtoken')

const checkHeaders = (req, res, next) => {
    if(!req.body.userName) {
        console.log('missing username or password')
        return req
    }
    
}


Router.use('*', jsonParser)

Router.get('/', function(req, res) {
    console.log('herego!')
})

Router.post('/', checkHeaders, function(req, res) {
    console.log('AuthPosters', req.body)
})

passport.use(new LocalStrategy(
	function(usr, pwd, done) {
		User.findOne({userName: usr}, function(err, usr) {
			if(err) {return done(err) }
			if (!usr) {
				return done(null, false, {message: 'Invalid username!'})
			}
			if (!user.validPassword(pwd)) {
				return done(null, false, {message: 'Invalid Password!!'})
			}
			return done(null, usr);
		});
	}
));


const checkToken = (req, res, next) => {
    /*https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4 */
    
}

// const checkHeaders = (req, res, next) => {
//     if(!req.body.userName || !req.body.passWord) {
//         console.log('missing username or password')
//         next();
//     }

// }


module.exports =  Router