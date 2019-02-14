const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const mongoose = require('mongoose')

const CommentPost = require('./commentsModel')

router.use(bodyParser.json())

router.get('/', (req, res) => {
	console.log('got to the Comments!')
})


/*can search for individual comments*/
        /*should be available for all accounts */

    /*make so can search for all comments by single author - maybe look into populate with virtuals */

// router.get('/find', (req, res) => {
// 	console.log('tried to find')
// 	CommentPost.find()
// 		.then(comments => {
// 			let list = [];
// 			comments.forEach(comment => {
// 				list.push(comment)
// 			})
// 			res.json(list)
// 		})
// 	res.status(200)
// })

/*Can create a new CommentPost */
		/*Access to All */
router.post('/create', jsonParser, (req, res) => {
	
	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['text', userId]
	let missing = requiredFields.filter(field => (!req.body[field]))
	if(missing.length > 0) {
		msg = `Missing ${missing} in header!`
				console.error(msg)
		 		return res.status(400).json(msg).end()
	}
	console.log(missing)

		// requiredFields.forEach(field => {
		// 	if (!req.body[field]) {
		// 		msg = `Missing ${field} in header!`
		// 		console.error(msg)
		// 		return res.status(400).json(msg).end()
		// 	}
		// })

	const { text, userId } = req.body
	
	console.log('made it to create!')
	
	CommentPost.create({
        text,
        userId
	})
	.then(newComment => {
		res.json(newComment)
		res.status(202)
})
	.catch(err => {
		return res.json(err.message).status(400)
	})

})

/*Admin or author only can update details */
router.put('/details/:id', (req, res) => {
	if(!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
					console.error(msg)
					return res.status(400).json(msg).end()
	}

	const { text, userId } = req.body
	const newDetails = {
        text,
        userId
	}
	CommentPost.findByIdAndUpdate(userIdd, {$set: newDetails}, {new: true})
	.then(updatedComment => {
		return res.json(updatedComment).status(203).end()
	})
	.catch(err => console.log(err, 27))
})



module.exports = router