const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
passport.use('JWT', jwtStrategy);
const jwtAuth = passport.authenticate('JWT', { session: false });

const User = require('../models/users');
const CommentPost = require('../models/comments');
const Post = require('../models/posts');

router.use(bodyParser.json());
router.use('*', jwtAuth);

router.get('/', (req, res) => {
	console.log(req.headers)
	console.log('got to the posts!')
});


/*can search Posts*/
/*should be available for all accounts */
router.get('/find/:id', (req, res) => {
	console.log(req.params.id)
	Post.find({event: req.params.id})
		.then(posts => {
			let list = [];
			posts.forEach(post => {
				list.push(post.serialize())
			})
			console.log(list.length)
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
		msg = `Missing ${missing} in header!`
		console.error(msg)
		return res.status(400).json(msg).end()
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
			res.json(newPost.serialize())
			res.status(202)
		})
		.catch(err => {
			return res.json(err.message).status(400)
		})

});


/*Admin only can update details */
router.put('/details/:id', (req, res) => {
	if (!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { title, author, body, id, postId, commentId } = req.body
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


/*Added / populate comments with newly created comment IDs */
router.put('/comment/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	const { postId, commentId } = req.body

	Post.findByIdAndUpdate(postId, { $push: { 'comments': commentId } }, { new: true })
		.then(updatedPost => {
			return res.json(updatedPost.serialize()).status(203).end()
		})
		.catch(err => console.log(err, 23))
});


router.delete('/purgeComments/:id', (req, res) => {
	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}
	
	CommentPost.find({postId: req.params.id})
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
	.catch(err => console.log(err, 23))
})


router.delete('/delete/:id', (req, res) => {


	if (!req.params.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}


	Post.findByIdAndDelete(req.params.id)
		.then(res.status(204).end())
		.catch(err => console.log(err, 23))
	
})


module.exports = router


