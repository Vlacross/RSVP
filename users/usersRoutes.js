const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const mongoose = require('mongoose')

const { User } = require('./models')

router.use(bodyParser.json())

router.get('/', (req, res) => {
	console.log('got to the users!')
})


/*can search user*/
router.get('/find', (req, res) => {
	console.log('tried to find')
	User.find()
		.then(users => {
			let list = [];
			users.forEach(user => {
				list.push(user.serialize())
			})
			res.json(list)
		})
	res.status(200)
})

/*Can create a new user account */
router.post('/create', jsonParser, (req, res) => {
	
	/*forEach wasn't handling err - allowed to pass to create */
	const requiredFields = ['fullname', 'username', 'password']
	let ring = requiredFields.filter(field => (!req.body[field]))
	if(ring.length > 0) {
		msg = `Missing ${ring} in header!`
				console.error(msg)
		 		return res.status(400).json(msg).end()
	}
	console.log(ring)

		// requiredFields.forEach(field => {
		// 	if (!req.body[field]) {
		// 		msg = `Missing ${field} in header!`
		// 		console.error(msg)
		// 		return res.status(400).json(msg).end()
		// 	}
		// })

	const { fullname: full, username: user, password: pass } = req.body

	console.log('haswhatneeds')
	User.checkUniquity(user)
	console.log('made it to create!')
	
	User.create({
		fullname: full,
		username: user,
		role: 'attendee',
		password: User.buildDigest(pass)
	})
	.then(newUser => {
		res.json(newUser.serialize())
		res.status(202)
})
	.catch(err => {
		return res.json(err.message).status(400)
	})

})

/*Admin or own User only can update details */
router.put('/details/:id', (req, res) => {
	if(!req.params.id || !req.body.id || req.body.id !== req.params.id) {
		let msg = `Incomplete credentials!`
					console.error(msg)
					return res.status(400).json(msg).end()
	}

	const { fullname, username, password, id } = req.body
	const newDetails = {
		fullname,
		username,
		password
	}
	User.findByIdAndUpdate(id, {$set: newDetails}, {new: true})
	.then(updatedUser => {
		return res.json(updatedUser.serialize()).status(203).end()
	})
	.catch(err => console.log(err, 22))
})



module.exports = router