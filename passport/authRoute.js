const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const jwtStrategy = require('./jwt')
const localStrategy = require('./local')

const passport = require('passport');
passport.use('local', localStrategy)
passport.use('JWT', jwtStrategy)
const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('JWT', { session: false})

const { JWT_SECRET, ALG, EXP } = require('../config')
const { User } = require('../models')


const opts = {
	algorithm: ALG,
	// iat: new Date(),
	expiresIn: EXP
}
const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
}


router.use(bodyParser.json())
router.use(express.static('./passport/views'))


router.post('/check', jwtAuth, (req, res) => {
	console.log('got to the Loggin Rodeo sun!', req.rawHeaders)

	// console.log(req.headers, req.rawHeaders)
	res.status(201)
})



router.post('/', localAuth, (req, res) => {
	if(!req) {console.log('err')}
	console.log('maider This farm!', req.user)
	let token = buildToken(req.user.username)
	let user = {
		id: req.user._id,
		fullname: req.user.fullname,
		username: req.user.username
	}
	res.json({ token, user })
})

/*moved here to bypass jwt check(ternary middleware was consuming time and magic links for future release) */
// const hallPass = (req, res, next) => {return req.method !== 'POST' ? jwtAuth : next()}
/*Can create a new user account */
router.post('/create', (req, res) => {
	console.log(req.body)

	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['fullname', 'username', 'password']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = `Missing ${missing} in header!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}
	console.log(missing)
	
	const { fullname: full, username: user, password: pass } = req.body

	console.log('haswhatneeds')
	User.checkUniquity(user)
	console.log('made it to create!')

	User.create({
		fullname: full,
		username: user,
		role: 'attendee',
		password: pass
	})
		.then(newUser => {

			res.json(newUser.serialize())
			res.status(202)
		})
		.catch(err => {
			return res.json(err.message).status(400)
		})

})




module.exports = router;
