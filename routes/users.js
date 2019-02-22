const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const localStrategy = require('../passport')
const jwtStrategy = require('../passport');

const passport = require('passport');
passport.use('JWT', jwtStrategy);
passport.use('local', localStrategy);

const jwtAuth = passport.authenticate('JWT', { session: false });
const localAuth = passport.authenticate('local', { session: false });

const User = require('../models/users');
const { JWT_SECRET, ALG, EXP } = require('../config')
router.use(bodyParser.json());
router.use('*', jwtAuth);
// const hallPass = (req, res, next) => {return req.method !== 'POST' ? jwtAuth : next()}

const opts = {
	algorithm: ALG,
	expiresIn: EXP
}
const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
}





/*can search user*/
router.get('/find', (req, res) => {
	User.find()
		.then(users => {
			let list = [];
			users.forEach(user => {
				list.push(user.serialize())
			})
			res.json(list)
		})
	res.status(200)
});

// (!req.params.id || !req.body.id || req.body.id !== req.params.id) 

/*Admin or own User only can update details */
router.put('/details/', (req, res) => {
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
			updatedUser.save(function (err) {
				if (err) throw new Error(err)
			})
			return updatedUser
		})
		.then(updatedUser => {
			let token = buildToken(updatedUser.username)
			let obj = {
				user:
				{
					id: updatedUser.id,
					fullname: updatedUser.fullname,
					username: updatedUser.username
				},
				token
			}
			return res.json(obj).status(203).end()
		})
		.catch(err => console.log(err, 22))
});


module.exports = router