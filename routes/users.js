const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');


const jwtStrategy = require('../passport');

const passport = require('passport');
passport.use('JWT', jwtStrategy);

const jwtAuth = passport.authenticate('JWT', { session: false });

const CommentPost = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');
const EventPlan = require('../models/events');

const { JWT_SECRET, ALG, EXP } = require('../config');

router.use(bodyParser.json());
router.use('*', jwtAuth);


const opts = {
	algorithm: ALG,
	expiresIn: EXP
};

const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
};


/*Find One User w. userId*/
router.get('/findOne/:id', (req, res) => {
	User.findOne({_id: req.params.id})
		.then(user => {
			res.json(user)
		})
	res.status(200)
});


/*can search users by eventId*/
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
 

/*Admin or own User only can update details */
router.put('/details/', (req, res) => {
	if (!req.body.id) {
		let msg = `Incomplete credentials!`
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

		return res.status(418).json(msg).end()
	}
	
	const newDetails = {
		fullname,
		username,
		password,
		attending,
		role
	}

	User.findByIdAndUpdate(id, { $set: newDetails }, { new: true })
		
		.then(updatedUser => {
			let token = buildToken(updatedUser.username)
			let obj = {
				user: updatedUser.serialize(),
				token: token
			}
			
			return res.json(obj).status(203).end()

		})
		.catch(err => console.error(err, 22))
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

	User.findById(id)
		.then(user => {
			if (user.username === "big" || user.username === "basicUser") {
				msg = {
					code: 418,
					message: `${user.username} is a protected account, can not alter!`,
					reason: `${user.username} is a protected account, can not alter!`
				}
				console.error(msg)
				return res.status(400).json(msg).end()
			}
			
			User.findByIdAndUpdate(id, { $set: { role: parseInt(role) } }, { new: true })
			.then(updatedUser => {
				return res.status(203).end()
			})
			
		})
		.catch(err => { console.log(err, 21.5)})
});

router.delete('/delete/:id', (req, res) => {
    if(!req.params.id) {
        console.error('missing \'id\'!!');
        return res.status(400).end()
    };
    const userId = req.params.id;
	
		User.findById(userId)
		.then(user => {
			if (user.username === "big" || user.username === "basicUser") {
				msg = {
					code: 418,
					message: `${user.username} is a protected account, can not alter!`,
					reason: `${user.username} is a protected account, can not alter!`
				}
				console.error(msg)
				return res.status(400).json(msg).end()
			}
		
		
   
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
     User.findOne({ _id: userId }, function(err, usr) {
		 if(err) {
			 return
		 }
		 usr.remove()
	 })
	.then(res.status(203).end()) 
	})
	.catch(err => { console.log(err, 21.5)})
});


module.exports = router