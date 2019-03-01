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

const seedEvents = require('../db/events');;
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
		console.log('dismounting DB')
		return mongoose.disconnect();
	});
}


var existingUser = {
	username: "user1",
	password: "password1"
};

var badUsername = {
	username: "nonexistant",
	password: "password1"
};

var badPassword = {
	username: "user1",
	password: "nonexistant"
};

var mockUser = {
	fullname: 'mockFull',
	username: 'mockUser',
	password: 'mockPass',
	event: '242424242424242424242424',
	role: 3,
	attending: true
};

var mockUserUpdate = {
	fullname: 'mockFullJr',
	username: 'mockUserJr',
	password: 'mockPassJr',
	event: '242424242424242424242424',
	role: 3,
	attending: 'false'
}

var mockUserPromoteRole = {
	role: 1
}

var mockEmptyUser = {};



describe('user route basic interactions', function () {

	testHooks()

	it('should perform a Unit test', function () {

		return User.find()
			.then(function (res) {
				expect(res).to.be.an('array')
			})
	})


	it('should perform a simple integration test', function () {
		return chai.request(app)
			.get('/users')
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

describe('User Get routes', function() {

	testHooks()

		it('should return Unauthorized without valid JWT', function () {
			return chai.request(app)
				.get('/users')
				.then(function (res) {
					console.log(res.text)
					expect(res.text).to.be.eql('Unauthorized')
				})
		})

		it('should return a single user', function () {

					return chai.request(app)
						.post(`/login/create`)
						.send(mockUser)
						.then(res => {
							let userId = res.body.user.id
							let token = res.body.token
							
							return chai.request(app)
							.get(`/users/findOne/${userId}`)
							.set('Authorization', `Bearer ${token}`)
							.set('Application', 'application/json')
							.set('Content-Type', 'application/json')
							.then(res => {
								console.log(res.body)
								expect(res.body).to.be.a('object')
								expect(res.body).to.not.be.an('array')
								expect(res.body).to.contain.keys('id', 'fullname', 'username', 'event', 'attending', 'createdAt', 'role')
								expect(res.body.id).to.eql(userId)
							})
							
						})
				});

		it('should return a list of users', function () {

			return chai.request(app)
				.post(`/login/create`)
				.send(mockUser)
				.then(res => {
					let eventId = res.body.user.event
					let token = res.body.token
					
					
					return chai.request(app)
					.get(`/users/find/${eventId}`)
					.set('Authorization', `Bearer ${token}`)
					.set('Application', 'application/json')
					.set('Content-Type', 'application/json')
					.then(res => {
						console.log(res.body[0])
						console.log(res.body[0].event.id)
						expect(res.body).to.be.an('array')
						expect(res.body[0]).to.be.an('object')
						expect(res.body[0]).to.contain.keys('id', 'fullname', 'username', 'event', 'attending', 'joinDate', 'role')
						expect(res.body[0].event.id).to.eql(eventId)
					})
					
				})
		});

			it('should update a single user and return updated data and token', function () {

					return chai.request(app)
						.post(`/login/create`)
						.send(mockUser)
						.then(res => {
							let token = res.body.token
							mockUserUpdate.id = res.body.user.id
							return chai.request(app)
							.put(`/users/details/`)
							.set('Authorization', `Bearer ${token}`)
							.set('Application', 'application/json')
							.set('Content-Type', 'application/json')
							.send(mockUserUpdate)
							.then(res => {
								expect(res.body).to.be.a('object')
								expect(res.body).to.contain.keys('user', 'token')
								expect(res.body.token).to.not.eql(token)
								expect(res.body.user.fullname).to.eql(mockUserUpdate.fullname)
								expect(res.body.user.username).to.eql(mockUserUpdate.username)
							})
							
						})
				});

				it('should change a user role from basic to masterAdmin', function () {

					return chai.request(app)
						.post(`/login/create`)
						.send(mockUser)
						.then(res => {
							let token = res.body.token
							mockUserPromoteRole.id = res.body.user.id
							console.log(mockUserUpdate)
							return chai.request(app)
							.put(`/users/roles/`)
							.set('Authorization', `Bearer ${token}`)
							.set('Application', 'application/json')
							.set('Content-Type', 'application/json')
							.send(mockUserPromoteRole)
							.then(res => {
								return chai.request(app)
								.get(`/users/findOne/${mockUserPromoteRole.id}`)
								.set('Authorization', `Bearer ${token}`)
								.set('Application', 'application/json')
								.set('Content-Type', 'application/json')
								.then(res => {
									console.log(res.body)
									expect(res).to.have.status(200)
									expect(res.body).to.be.a('object')
									expect(res.body.role).to.eql(mockUserPromoteRole.role)
									expect(res.body.role).to.not.eql(mockUser.role)
								})

							})
							
						})
				});
	




















})














