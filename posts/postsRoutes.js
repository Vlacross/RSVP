const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const mongoose = require('mongoose')

const Post = require('./postsModel')

router.use(bodyParser.json())

router.get('/', (req, res) => {
	console.log('got to the posts!')
})


/*can search Posts*/
		/*should be available for all accounts */
router.get('/find', (req, res) => {
	console.log('tried to find')
	Post.find()
		.then(posts => {
			let list = [];
			posts.forEach(post => {
				list.push(post.serialize())
			})
			res.json(list)
		})
	res.status(200)
})

/*Can create a new Post */
		/*Add Auth for Support Accounts Only */
router.post('/create', jsonParser, (req, res) => {
	
	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['title', 'author', 'body']
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

	const { title, author, body } = req.body
	
	console.log('made it to create!')
	
	Post.create({
		title,
		author,
		body
	})
	.then(newPost => {
		res.json(newPost.serialize())
		res.status(202)
})
	.catch(err => {
		return res.json(err.message).status(400)
	})

})

/*Admin only can update details */
router.put('/details/:id', (req, res) => {
	if(!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
					console.error(msg)
					return res.status(400).json(msg).end()
	}

	const { title, author, body, id } = req.body
	const newDetails = {
		title,
		author,
		body
	}
	User.findByIdAndUpdate(id, {$set: newDetails}, {new: true})
	.then(updatedPost => {
		return res.json(updatedPost.serialize()).status(203).end()
	})
	.catch(err => console.log(err, 23))
})



module.exports = router