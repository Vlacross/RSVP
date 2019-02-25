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
const EventPlan = require('../models/events');
const { levelOne, levelTwo, validateEvent, validateAttendance, checkEventName } = require('../Roles/checkWare')

const opts = {
	algorithm: ALG,
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
	User.findOne({_id: req.user.id})
	.then(user => {
		console.log(user.serialize())
		let userData = user.serialize()
		res.json({ token, userData })
		
	})
})

/*Check event before signup */
router.post('/eventCheck', validateEvent, (req, res) => {
	if(!req) {console.log('err')}
	console.log(req.body)
	EventPlan.find({name: req.body.eventName})
	.then(event => {
		let succ = {
			event: event,
			message: 'true'
		}
		res.json(succ).status(200).end()
	})
	
})

/*Can create a new user account */
router.post('/create', (req, res) => {
	console.log(req.body)

	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['fullname', 'username', 'password', 'event', 'role', 'attending']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = `Missing ${missing} in header!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}
	console.log(missing)
	
	const { fullname: full, username: user, password: pass, event, role, attending } = req.body

	console.log('haswhatneeds')
	User.checkUniquity(user)
	console.log('made it to create!')

	User.create({
		fullname: full,
		username: user,
		role: parseInt(role),
		password: pass,
		event: event,
		attending: attending
	})

	.then(newUser => {
		let token = buildToken(newUser.username)
		let user = newUser.serialize()
		res.json({ token, user })
		res.status(202)
	})
	.catch(err => {
		return res.json(err.message).status(400)
	})

});



/*Can create a new Event */
router.post('/newEvent', checkEventName, (req, res) => {

	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['name', 'host', 'dateOfEvent', 'contactInfo', 'summary']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = `Missing ${missing} in header!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	/*validate masterAdmin account details gathered before create */
	const { name, host, dateOfEvent, contactInfo, summary } = req.body

	EventPlan.create({
		name,
		host,
		dateOfEvent,
		contactInfo,
		summary
	})
		.then(newEvent => {
			res.json(newEvent.serialize())
			res.status(202)
		})
		.catch(err => {
			return res.json(err.message).status(400)
		})

});




module.exports = router;
