const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')

const localStrategy = require('../passport')
const jwtStrategy = require('../passport');

const passport = require('passport');
passport.use('JWT', jwtStrategy)
passport.use('local', localStrategy)

const jwtAuth = passport.authenticate('JWT', { session: false})
const localAuth = passport.authenticate('local', { session: false });

const User = require('../models/usersModel')

// const hallPass = (req, res, next) => {return req.method !== 'POST' ? jwtAuth : next()}


router.use(bodyParser.json())
router.use('*', jwtAuth)

router.get('/', (req, res) => {
	console.log('got to the users!')
})


/*can search user*/
router.get('/find', (req, res) => {
	console.log('tried to find all users')
	User.find()
		.then(users => {
			let list = [];
			users.forEach(user => {
				list.push(user.serialize())
			})
			res.json(list)
		})
	res.status(200)
})

/*find current account in use/ find own accout details */

router.get('/findme', (req, res) => {
	console.log('finding', req.user.username)
	res.send(req.user).status(200).end()
})

/*Can create a new user account */
router.post('/create', (req, res) => {
	console.log('hitting the doors of creation')

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

router.post('/test', function (req, res) {
	User.findOne({ username: req.body.username }, function (err, user) {
		if (err) { throw err }

		user.comparePassword(req.body.password, function (isMatch) {
			if (err) { console.log('noMatches BRO!', err) }
			console.log(`${req.body.password}`, isMatch)
		})
	})
		.catch(err => console.log(err))
})

// (!req.params.id || !req.body.id || req.body.id !== req.params.id) 

/*Admin or own User only can update details */
router.put('/details/', (req, res) => {
	console.log('updateCentrals', req.body)
	if (!req.body.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	let { fullname, username, password, id } = req.body
	
	const newDetails = {
		fullname,
		username,
		password
	}

	User.findByIdAndUpdate(id, { $set: newDetails }, { new: true })
		.then(updatedUser => {
			 updatedUser.save(function(err) {
				if(err) throw new Error(err)
			})
			return updatedUser
		})
		.then(updatedUser => {
			let obj = {user: 
				{id: updatedUser.id,
				fullname: updatedUser.fullname,
				username: updatedUser.username}
			}
			return res.json(obj).status(203).end()
		})
		.catch(err => console.log(err, 22))
})




module.exports = router