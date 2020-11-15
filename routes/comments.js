const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
const jwtAuth = passport.authenticate('JWT', { session: false });
passport.use('JWT', jwtStrategy);

const { Comment, Post} = require('../models');

router.use(bodyParser.json());
router.use('*', jwtAuth);


	/*Can create a new Comment */
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

	/*add validation for user/author */

	const { text, userId, postId, event } = req.body
	const comment = {
		text,
		userId,
		postId,
		event
	};
	Comment.create(comment)
		.then(newComment => {
			res.status(202).json(newComment)

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
	Comment.findOne({_id: req.params.id})
	.then(comment => {
		return Post.findByIdAndUpdate(comment.postId, { $pull: { 'comments': req.params.id }}
		)
	})
	.catch(err => console.log(err))

	Comment.findByIdAndRemove(req.params.id)
		.then(res.status(204).end() )
		.catch(err => console.log(err))
});

module.exports = router