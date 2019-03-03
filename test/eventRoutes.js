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



const jwt = require('jsonwebtoken')
const { JWT_SECRET, ALG, EXP } = require('../config')


const opts = {
	algorithm: ALG,
	expiresIn: EXP
}



const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
}


var mockEvent = {
	name: 'mockEvent',
	host: 'mockHost',
	dateOfEvent: new Date(),
	contactInfo: 'mock@mock.com',
	summary: 'mockSummary'
};


var preMockEvent = {
	name: 'preMockEvent',
	host: 'preMockHost',
	dateOfEvent: new Date(),
	contactInfo: 'preMock@mock.com',
	summary: 'preMockSummary'
};

var mockUser = {
	fullname: 'mockFull',
	username: 'mockUser',
    password: 'mockPass',
    event: '242424242424242424242424',
	role: 3,
	attending: true
};

var preMockUser = {
	fullname: 'preMockFull',
	username: 'preMockUser',
    password: 'preMockPass',
    event: '242424242424242424242424',
	role: 3,
	attending: true
};



describe('event routes actions', function() {


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
					EventPlan.insertMany(seedEvents),
					User.create(preMockUser),
					EventPlan.create(preMockEvent)
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


	describe('post route basic interactions', function () {

	

		it('should return fail', function () {
	
			return EventPlan.find()
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

	describe('event GET route', function() {

		
		it.only('should find an event by id', async function() {

			let eventId;
			await EventPlan.findOne({name: 'preMockEvent'})
			.then(res => {
				eventId = res.id	
				})
	
			let token = await buildToken(preMockUser.username)

		return chai.request(app)
			.get(`/events/find/${eventId}`)
			.set('Authorization', `Bearer ${token}`)
			.set('Application', 'application/json')
			.set('Content-Type', 'application/json')
			.then(res => {
				console.log(res.body)
				expect(res).to.have.status(200)
				expect(res.body).to.be.an('object')
				expect(res.body.id).to.eql(eventId)
			})
	
	
		})
	
	
	
	
	
	})






})












