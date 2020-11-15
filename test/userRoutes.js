const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');

const { MONGODB_URI_TEST } = require('../config');
const { connectDatabase, disconnectDatabase, seedDatabase } = require('../utils/dbActions');
const { User } = require('../models');


chai.use(chaiHttp);

const { app } = require('../server');


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
};

var mockUserPromoteRole = {
	role: 1
};


describe('all userRoute actions', function() {


		before(function () {
			console.log('mounting DB: ', MONGODB_URI_TEST)
			return connectDatabase()
		});

		beforeEach(function () {

			console.info('Dropping Database');
			let db = mongoose.connection.db
			return seedDatabase(db);
		});

		after(function () {
			console.log('dismounting DB')
			return disconnectDatabase();
		});


	describe('User route basic interactions', function () {


		it('should prove Unit functions', async function () {

			
			return await User.find()
				.then(function (res) {
					expect(res).to.be.an('array')
				})
		});


		it('should return Unauthorized without proper credentials', function () {
			return chai.request(app)
				.get('/users')
				.then(function (res) {
					expect(res.text).to.be.eql('Unauthorized')
				})
		});

		it('should return token and user data', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res.body).to.include.keys('token', 'user')
				})
		});

	});


	describe('User Get routes', function () {


		it('should return Unauthorized without valid JWT', function () {
			return chai.request(app)
				.get('/users')
				.then(function (res) {
					expect(res.text).to.be.eql('Unauthorized')
				})
		});

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
							expect(res.body).to.be.an('array')
							expect(res.body[0]).to.be.an('object')
							expect(res.body[0]).to.contain.keys('id', 'fullname', 'username', 'event', 'attending', 'joinDate', 'role')
							expect(res.body[0].event.id).to.eql(eventId)
						})

				})
		});

	});


	describe('User Put routes', function () {


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
									expect(res).to.have.status(200)
									expect(res.body).to.be.a('object')
									expect(res.body.role).to.eql(mockUserPromoteRole.role)
									expect(res.body.role).to.not.eql(mockUser.role)
								})

						})

				})
		});

	});


	describe('User delete route', function () {


		it('should delete a single user', async function () {

			return await chai.request(app)
				.post(`/login/create`)
				.send(mockUser)
				.then(res => {
					let token = res.body.token

					return chai.request(app)
						.delete(`/users/delete/${res.body.user.id}`)
						.set('Authorization', `Bearer ${token}`)
						.set('Application', 'application/json')
						.set('Content-Type', 'application/json')
						.then(res => {
							expect(res).to.have.status(203)
						})

				})
		});



	});


});

