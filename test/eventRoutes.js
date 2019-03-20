const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const DB = mongoose.connection;
const bcrypt = require('bcryptjs');

const { MONGODB_URI_TEST } = require('../config');

const Post = require('../models/posts');
const User = require('../models/users');
const CommentPost = require('../models/comments');
const EventPlan = require('../models/events');

const seedEvents = require('../db/events');
const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');


chai.use(chaiHttp);

const { app } = require('../server');

const jwt = require('jsonwebtoken')
const { JWT_SECRET, ALG, EXP } = require('../config');


const opts = {
	algorithm: ALG,
	expiresIn: EXP
};

const buildToken = function (user) {
	return jwt.sign({ user }, JWT_SECRET, opts
	)
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


describe('Event routes actions', function() {


	before(function () {

		console.log('mounting DB: ', MONGODB_URI_TEST)
		return mongoose.connect(MONGODB_URI_TEST, { useNewUrlParser: true })
	})

	beforeEach(function () {

		console.log('Dropping Database');
		 return mongoose.connection.db.dropDatabase()
			.then(() => {
				return Promise.all(seedUsers.map(user => bcrypt.hash(user.password, 10)));
			})
			.then(function(digests) {
				seedUsers.forEach((user, i) => user.password = digests[i]);
				console.log('Seeding database')
				return Promise.all([
					Post.insertMany(seedPosts),
					User.insertMany(seedUsers),
					CommentPost.insertMany(seedComments),
					EventPlan.insertMany(seedEvents),
					EventPlan.create(preMockEvent),
					User.create(preMockUser)
				])
			})
			.catch(err => {
				console.error(`ERROR: ${err.message}`);
				console.error(err);
			})
	})

	after(function () {
		console.log('dismounting DB')
		return mongoose.disconnect();
	});



	describe('Event route basic interactions', function () {

	
		it('should prove unit functions', function () {

			return EventPlan.find()
				.then(function(res) {
					expect(res).to.be.an('array')
				})
		});
	
	
		it('should return unauthorized without credentials', function () {
			return chai.request(app)
				.get('/events')
				.then(function (res) {
					expect(res.text).to.be.eql('Unauthorized')
				})
		});
	
	});


	describe('Event GET route', function() {

		
		it('should find an event by id', function() {

				let eventId;

				EventPlan.findOne({name: 'preMockEvent'})
				.then(res => {
					eventId = res.id	

					let token = buildToken(preMockUser.username)

					return chai.request(app)
					.get(`/events/find/${eventId}`)
					.set('Authorization', `Bearer ${token}`)
					.set('Application', 'application/json')
					.set('Content-Type', 'application/json')
						.then(res => {
							expect(res).to.have.status(200)
							expect(res.body).to.be.an('object')
							expect(res.body.id).to.eql(eventId)
						})
					
					});
				})
	});

});












