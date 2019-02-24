const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
passport.use('JWT', jwtStrategy);
const jwtAuth = passport.authenticate('JWT', { session: false });

const CommentPost = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');
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


/*MasterAdmin only can update details */
router.put('/details/:id', (req, res) => {
	if (!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { name, host, body, id, postId, commentId } = req.body
	const newDetails = {
		title,
		author,
		body
	}
	Post.findByIdAndUpdate(id, { $set: newDetails }, { new: true })
		.then(updatedPost => {
			return res.json(updatedPost.serialize()).status(203).end()
		})
		.catch(err => console.log(err, 23))
});


/*************************************************************************************************/
				/*ATTENDEE POPULATION/DEPOPULATION */
/*************************************************************************************************/
/*Added / populate Event attendees with newly created User IDs */
router.put('/attendee/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { eventId, userId } = req.body

	EventPlan.findByIdAndUpdate(eventId, { $push: { 'comments': userId } }, { new: true })
		.then(updatedEvent => {
			return res.json(updatedEvent.serialize()).status(203).end()
		})
		.catch(err => console.log(err, 23))
});

/*remove/ depopulate event attendees */
router.put('/attendee-remove/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { eventId, userId } = req.body

	Post.findByIdAndUpdate(eventId, { $pull: { 'comments': userId } }, { new: true })
		.then(updatedEvent => {
			return res.json(updatedEvent.serialize()).status(203).end()
		})
		.catch(err => console.log(err, 23))
});
/*************************************************************************************************/


/*
Purge all comments with event name ref
Then posts
then users
then event

*/
router.delete('/delete/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	};


	let eventId = req.params.id
/*Purge subDocs */
	CommentPost.find({event: eventId})
	.then(comments => {
		comments.forEach(comment => comment.remove())
	})
/*purge static docs */
	Post.find({event: eventId})
		.then(posts => {
				posts.forEach(post => {
						post.remove()
				});  
})
/*Purge Accounts and active docs */
User.find({event: eventId})
.then(users => {
	showUsers.forEach(user => user.remove())
})
/*Self destruct */
EventPlan.findByIdAndDelete(eventId)
.then(res.status(204).end())
.catch(err => console.log(err, 23))

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