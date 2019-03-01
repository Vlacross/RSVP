const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const DB = mongoose.connection;
const bcrypt = require('bcryptjs')

const { MONGODB_URI_TEST } = require('../config');

const Post = require('../models/posts');
const User = require('../models/users');
const CommentPost = require('../models/comments');
const EventPlan = require('../models/events');

const seedEvents = require('../db/events');
const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');


chai.use(chaiHttp)


const { app } = require('../server');




function testHooks() {

	before(function () {
		console.log('mounting DB: ', MONGODB_URI_TEST)
		return mongoose.connect(MONGODB_URI_TEST, { useNewUrlParser: true })

	})
	beforeEach(function () {

		console.info('Dropping Database');
		return mongoose.connection.db.dropDatabase()
			.then(() => {
				return Promise.all(seedUsers.map(user => bcrypt.hash(user.password, 10)));
			})
			.then((digests) => {
				seedUsers.forEach((user, i) => user.password = digests[i]);
				console.log('Seeding database')
				return Promise.all([
					Post.insertMany(seedPosts),
					User.insertMany(seedUsers),
					CommentPost.insertMany(seedComments),
					EventPlan.insertMany(seedEvents)
				]);
			})
			.catch(err => {
				console.error(`ERROR: ${err.message}`);
				console.error(err);
			});
	});
	after(function () {
		return mongoose.disconnect();
	});
}

var mockUser = {
	fullname: 'mockFull',
	username: 'mockUser',
	password: 'mockPass',
	event: '242424242424242424242424',
	role: 3,
	attending: true
};





describe('post route basic interactions', function () {

	testHooks()

	it('should perform a Unit test', function () {

		return Post.find()
			.then(function (res) {
				expect(res).to.be.an('array')
			})
	})


	it('should perform a simple integration test', function () {
		return chai.request(app)
			.get('/posts')
			.then(function (res) {
				console.log(res.text)
				expect(res.text).to.be.eql('Unauthorized')
			})
	})

	it('should return token and user data', function () {

		return chai.request(app)
			.post('/login/create')
			.send(mockUser)
			.then(res => {
				console.log(res.body)
				expect(res.body).to.include.keys('token', 'user')
			})
	});

});

describe('Post Model Get routes', function () {

	testHooks()

		it('should find all posts for event', function () {

				return chai.request(app)
					.post(`/login/create`)
					.send(mockUser)
					.then(res => {
						let token = res.body.token
						let event = res.body.user.event

						return chai.request(app)
							.get(`/posts/find/${event}`)
							.set('Authorization', `Bearer ${token}`)
							.set('Application', 'application/json')
							.set('Content-Type', 'application/json')
							.then(res => {
								console.log(res.body)
								expect(res).to.have.status(200)
								expect(res.body).to.be.an('array')
								expect(res.body[0]).to.be.an('object')
								expect(res.body[0]).to.contain.keys('id', 'title', 'author', 'body', 'event', 'comments', 'createdAt')
								expect(res.body[0].event).to.eql(mockUser.event)
							})

					})
			});

			it.only('should find a single post', function () {

				return chai.request(app)
					.post(`/login/create`)
					.send(mockUser)
					.then(res => {
						let token = res.body.token
						let event = res.body.user.event

						return chai.request(app)
							.get(`/posts/find/${event}`)
							.set('Authorization', `Bearer ${token}`)
							.set('Application', 'application/json')
							.set('Content-Type', 'application/json')
							.then(res => {
								console.log(res.body[0].id)
								let post = res.body[0].id
								return chai.request(app)
								.get(`/posts/findPost/${post}`)
								.set('Authorization', `Bearer ${token}`)
								.set('Application', 'application/json')
								.set('Content-Type', 'application/json')
								.then(res => {
									console.log(res.body)
									expect(res).to.have.status(200)
									expect(res.body).to.be.an('object')
									expect(res.body.comments).to.be.an('array')
									expect(res.body).to.contain.keys('id', 'title', 'author', 'body', 'event', 'comments', 'createdAt')
									expect(res.body.id).to.eql(post)
								})
							})

					})
			});






});

describe('Post Model update (sub-doc populate/remove) routes', function () {

	testHooks()

	


});

describe('Post Model delete route', function () {

	testHooks()

	// it('should delete a single post', function () {

	// 	return chai.request(app)
	// 		.post(`/login/create`)
	// 		.send(mockUser)
	// 		.then(res => {
	// 			let token = res.body.token

	// 			return chai.request(app)
	// 				.delete(`/users/delete/${res.body.user.id}`)
	// 				.set('Authorization', `Bearer ${token}`)
	// 				.set('Application', 'application/json')
	// 				.set('Content-Type', 'application/json')
	// 				.then(res => {
	// 					expect(res).to.have.status(204)
	// 				})

	// 		})
	// });



});












