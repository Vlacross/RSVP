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
	console.log('maider This farm!')
	let token = buildToken(req.user.username)
	res.json({ token })
})

module.exports = router;
