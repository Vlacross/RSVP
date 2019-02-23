const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
passport.use('JWT', jwtStrategy);
const jwtAuth = passport.authenticate('JWT', { session: false });

const Post = require('../models/posts');
const EventPlan = require('../models/events');
const { levelOne, levelTwo, validateEvent, validateAttendance } = require('../Roles/checkWare')

router.use(bodyParser.json());
// router.use('*', jwtAuth);

router.get('/', (req, res) => {
	console.log(req.headers)
	console.log('got to the events!')
});


router.post('/validate', validateEvent, validateAttendance, (req, res) => {

	console.log(req.body)


	console.log('past it')
	
});


router.get('/find', (req, res) => {
	EventPlan.find()
		.then(events => {
			let list = [];
			events.forEach(event => {
				list.push(event.serialize())
			})
			res.json(list)
		})
	res.status(200)
});



















module.exports = router















// router.post('/validate', (req, res) => {
// 	if(!req.body.eventName){
//     let msg = 'missing eventName in header!';
//     console.log(msg)
//     return res.status(400).json(msg).end()
// }
// let eventName = req.body.eventName
// EventPlan.find({})
//     .then(events => {
//         console.log(events.length)
//         let validMatch = events.filter(event => event.name === eventName)
//         if (validMatch === 0) {
//            return Promise.reject({message: 'invalid event name!'})
//         }

//     })
//     .catch(err => {

//         res.status(400).json(msg).end()
//     })
	
// });