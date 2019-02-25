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
const Post = require('./../models/posts');
const { levelOne, levelTwo } = require('../Roles/checkWare')

router.use(bodyParser.json());
router.use('*', jwtAuth);

router.get('/', (req, res) => {
	console.log('got to the Comments!')
});

	/*Can create a new CommentPost */
	/*Access to All */
router.post('/create', jsonParser, (req, res) => {
	console.log('buddy', req.body)

	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['text', 'userId', 'event', 'postId']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = `Missing ${missing} in header!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}
	console.log(missing)

	/*add validation for user/author */

	const { text, userId, postId, event } = req.body
	console.log('made it to create!')
	const comment = {
		text,
		userId,
		postId,
		event
	};
	CommentPost.create(comment)
		.then(newComment => {
			console.log('new commentsial', newComment)
			res.json(newComment).status(202)

		})
		.catch(err => {
			return res.json(err.message).status(400)
		});


});


	/*Admin or author only can update details */
router.put('/details/:id', (req, res) => {
	if (!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { text, userId } = req.body
	const newDetails = {
		text,
		userId
	}
	CommentPost.findByIdAndUpdate(userIdd, { $set: newDetails }, { new: true })
		.then(updatedComment => {
			return res.json(updatedComment).status(203).end()
		})
		.catch(err => console.log(err, 27))
});

		/*Admin or author only can delete details */
router.delete('/delete/:id', (req, res) => {
	if (!req.params.id) {
		console.error('missing \'id\'!!')
		return res.status(400)
	};
	CommentPost.findByIdAndDelete(req.params.id)
		.then(res.status(204).end()
		)
});

module.exports = router