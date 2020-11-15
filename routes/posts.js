const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
passport.use('JWT', jwtStrategy);
const jwtAuth = passport.authenticate('JWT', { session: false });

const { Comment, Post} = require('../models');

router.use(bodyParser.json());
router.use('*', jwtAuth);


/*can search Posts*/
/*should be available for all accounts */
router.get('/find/:id', (req, res) => {
	Post.find({event: req.params.id})
		.then(posts => {
			let list = [];
			posts.forEach(post => {
				list.push(post.serialize())
			})
			res.json(list)
		})
	res.status(200)
});

router.get('/findPost/:id', (req, res) => {
	Post.findOne({ _id: req.params.id })
		.then(post => {
			res.json(post.serialize())
		});
	res.status(200);
});


/*Can create a new Post */
/*Add Auth for Support Accounts Only */
router.post('/create', jsonParser, (req, res) => {

	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['title', 'author', 'body', 'event']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = {
			message: `Missing ${missing} in header!`
		}
		console.error(msg)
		return res.status(422).json(msg).end()
	}

	/*add validation for user/author */
	const { title, author, body, event } = req.body

	Post.create({
		title,
		author,
		body,
		event
	})
	.then(newPost => {
		res.status(202).json(newPost.serialize())
	})
	.catch(err => {
		return res.json(err.message).status(400)
	})

});

router.delete('/purgeComments/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}
	
	Comment.find({postId: req.params.id})
		.then(comments => {
			comments.forEach(comment => comment.remove())
		})

	Post.findOne({_id: req.params.id})
		.then(post => {
			let comments = post.comments;
			comments.forEach(comment => {
				comment.remove()
			})
		})
	
	.then(res.status(204).end())
	.catch(err => console.error(err, 23))
});


router.delete('/delete/:id', (req, res) => {


	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}


	Post.findByIdAndDelete(req.params.id)
		.then(res.status(204).end())
		.catch(err => console.error(err, 23))
	
});


module.exports = router

