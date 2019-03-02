const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
const jwtAuth = passport.authenticate('JWT', { session: false });
passport.use('JWT', jwtStrategy);

const CommentPost = require('../models/comments');
const Post = require('./../models/posts');

router.use(bodyParser.json());
router.use('*', jwtAuth);


	/*Can create a new CommentPost */
	/*Access to All roles */
router.post('/create', jsonParser, (req, res) => {

	/*forEach wasn't breaking script on 'return' - continued to pass to create */
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

		/*Admin or author only can delete details */
router.delete('/delete/:id', (req, res) => {
	if (!req.params.id) {
		console.error('missing \'id\'!!')
		return res.status(400)
	};
	CommentPost.findOne({_id: req.params.id})
	.then(comment => {
		console.log(comment.postId)
		Post.findByIdAndUpdate(comment.postId, { $pull: { 'comments': req.params.id }}, function (err, post) {
			console.log('pre', post)
			post.update({ $pull: { 'comments': req.params.id}})
			console.log('post', post)
			
		}
		)
	})

	CommentPost.findByIdAndRemove(req.params.id)
		.then(res.status(204).end()
		)
});

module.exports = router