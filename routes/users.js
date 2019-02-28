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

const CommentPost = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');
const EventPlan = require('../models/events');

const { JWT_SECRET, ALG, EXP } = require('../config')
router.use(bodyParser.json());
router.use('*', jwtAuth);


const opts = {
	algorithm: ALG,
	expiresIn: EXP
}
const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
}

/*Find One User */
router.get('/findOne/:id', (req, res) => {
	User.findOne({_id: req.params.id})
		.then(user => {
			
			res.json(user)
		})
	res.status(200)
})

/*can search user*/
router.get('/find/:id', (req, res) => {
	User.find({event: req.params.id})
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


	let { fullname, username, password, id, attending, role } = req.body

	const requiredFields = ['fullname', 'username', 'password', 'attending']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = {
			code: 422,
			message: `Missing ${missing} in header!`,
			reason: `Missing ${missing} in header!`
		}
		console.error(msg)
		return res.status(418).json(msg).end()
	}
	console.log(missing)
	
	const newDetails = {
		fullname,
		username,
		password,
		attending,
		role
	}

	User.findByIdAndUpdate(id, { $set: newDetails }, { new: true })
		
		.then(updatedUser => {
			console.log('updatedUSER', updatedUser)
			let token = buildToken(updatedUser.username)
			let obj = {
				user: updatedUser.serialize(),
				token: token
			}
			console.log('obj', obj)
			return res.json(obj).status(203).end()

		})
		.catch(err => console.log(err, 22))
});

/*strictly for setting userRole */
router.put('/roles', (req, res) => {

	if (!req.body.id) {
		let msg = `Incomplete credentials!`
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	let { id, role } = req.body

	const requiredFields = ['id', 'role']
	let missing = requiredFields.filter(field => (!req.body[field]))
	if (missing.length > 0) {
		msg = {
			code: 422,
			message: `Missing ${missing} in header!`,
			reason: `Missing ${missing} in header!`
		}
		console.error(msg)
		return res.status(400).json(msg).end()
	}

	User.findByIdAndUpdate(id, { $set: { role: parseInt(role) } }, { new: true })
		.then(updatedUser => {
			console.log('updatedUSER', updatedUser)
			return res.status(203).end()
		})
		.catch(err => console.log(err, 22))
});

router.delete('/delete/:id', (req, res) => {
    if(!req.params.id) {
        console.error('missing \'id\'!!');
        return res.status(400).end()
    };
    const userId = req.params.id;
    // console.log(userId)
	
	// EventPlan
	// Post.findByIdAndUpdate(postId, { $push: { 'comments': commentId } }, { new: true })
	// 	.then(updatedPost => {
	// 		return res.json(updatedPost.serialize()).status(203).end()
	// 	})
   
    Post.find({author: userId})
        .then(posts => {
            posts.forEach(post => {
				
                post.remove()
            });  
		});
	CommentPost.find({userId: userId})
		.then(comments => {
			comments.forEach(comment => comment.remove())
		})
     User.findOne({ _id: userId }).remove()
	.then(res.status(204).end()) 
});


module.exports = router