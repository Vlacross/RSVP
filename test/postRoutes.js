const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');

const { MONGODB_URI_TEST } = require('../config');
const { connectDatabase, disconnectDatabase, seedDatabase } = require('../utils/dbActions');
const Post = require('../models/posts');

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

var mockPost = {
	title: 'mockTitle',
	body: 'mockBody',
	event: '242424242424242424242424'
};

var emptyMockPost = {};

describe('post route actions', function() {


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




describe('post route basic interactions', function () {

	

	it('should prove Unit function', async function () {

		return await Post.find()
			.then(function (res) {
				expect(res).to.be.an('array')
			})
	});


	it('should fail without proper credentials', function () {
		return chai.request(app)
			.get('/posts')
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

describe('Post Model Get routes', function () {



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
						expect(res).to.have.status(200)
						expect(res.body).to.be.an('array')
						expect(res.body[0]).to.be.an('object')
						expect(res.body[0]).to.contain.keys('id', 'title', 'author', 'body', 'event', 'comments', 'createdAt')
						expect(res.body[0].event).to.eql(mockUser.event)
					})

			})
	});

	it('should find a single post', function () {

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
						let post = res.body[0].id
						return chai.request(app)
						.get(`/posts/findPost/${post}`)
						.set('Authorization', `Bearer ${token}`)
						.set('Application', 'application/json')
						.set('Content-Type', 'application/json')
						.then(res => {
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

describe('Post model create route', function() {

	it('should return fail with insufficient data', function() {

		return chai.request(app)
		.post('/login/create')
		.send(mockUser)
		.then(res => {
			let token = res.body.token
			return chai.request(app)
			.post('/posts/create')
			.set('Authorization', `Bearer ${token}`)
			.set('Application', 'application/json')
			.set('Content-Type', 'application/json')
			.send(emptyMockPost)
			.then(res => {
				expect(res).to.have.status(422)
				expect(res.body.message).to.eql('Missing title,author,body,event in header!')
			})
		})
	});



	it('should create a post', function() {

		return chai.request(app)
		.post('/login/create')
		.send(mockUser)
		.then(res => {
			let token = res.body.token
			mockPost.author = res.body.user.id
				return chai.request(app)
				.post('/posts/create')
				.set('Authorization', `Bearer ${token}`)
				.set('Application', 'application/json')
				.set('Content-Type', 'application/json')
				.send(mockPost)
				.then(res => {
					expect(res).to.have.status(202)
					expect(res.body).to.be.an('object')
					expect(res.body).to.contain.keys('id', 'title', 'body', 'event', 'comments', 'createdAt')
					expect(res.body.title).is.eql(mockPost.title)
				})
		})
	});

});


describe('Post Model delete route', function () {


	it('should delete a single post', async function () {

		return await chai.request(app)
		.post('/login/create')
		.send(mockUser)
		.then(res => {
			let token = res.body.token
			mockPost.author = res.body.user.id
				return chai.request(app)
				.post('/posts/create')
				.set('Authorization', `Bearer ${token}`)
				.set('Application', 'application/json')
				.set('Content-Type', 'application/json')
				.send(mockPost)
				.then(res => {
					let post = res.body.id
					return chai.request(app)
					.delete(`/posts/delete/${post}`)
					.set('Authorization', `Bearer ${token}`)
					.set('Application', 'application/json')
					.set('Content-Type', 'application/json')
					.then(res => {
						expect(res).to.have.status(204)
					})
				})

			})
	});



});


});

