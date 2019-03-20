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


var mockPost = {
	title: 'mockTitle',
	body: 'mockBody',
	event: '242424242424242424242424'
};


var preMockPost = {
	title: 'preMockTitle',
	body: 'preMockBody',
	event: '242424242424242424242424'
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

var preMockEvent = {
	name: 'preMockEvent',
	host: 'preMockHost',
	dateOfEvent: new Date(),
	contactInfo: 'preMock@mock.com',
	summary: 'preMockSummary'
};


var mockComment = {
	text: 'mockText'
};

var preMockComment = {
	_id: "878787878787878787878787",
 	text: "gorganzanta",
	event: "242424242424242424242424",
	userId: "333333333333333333333301"
};

var emptyComment = {};



describe('Comment routes actions', function() {


	before(function () {

		console.log('mounting DB: ', MONGODB_URI_TEST)
		return mongoose.connect(MONGODB_URI_TEST, { useNewUrlParser: true })
	});

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
					Post.create(preMockPost),
					User.create(preMockUser),
					EventPlan.insertMany(preMockEvent)
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


	describe('Comment route basic interactions', function () {

	

		it('should prove unit functions', async function () {
	
			return await CommentPost.find()
				.then(function (res) {
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

	describe('Comment Post route', function() {


		it('should create a new comment', async function() {

			let token = await buildToken(preMockUser.username)

			let eventId;
			let postId;
			let userId;

			await EventPlan.findOne({name: 'preMockEvent'})
			.then(res => {
				eventId = res.id	
			})
			await Post.findOne({title: 'preMockTitle'})
			.then(res => {
				postId = res.id
			})
			await User.findOne({username: 'preMockUser'})
			.then(res => {
				userId = res.id
			})
			mockComment.event = eventId;
			mockComment.postId = postId;
			mockComment.userId = userId;
			return chai.request(app)
			.post('/comments/create')
			.set('Authorization', `Bearer ${token}`)
			.set('Application', 'application/json')
			.set('Content-Type', 'application/json')
			.send(mockComment)
			.then(res => {
				expect(res).to.have.status(200)
			

			})

		});

	});


	describe('Comment Delete Route', function() {

		it('should delete a comment', async function() {

			let comment;
			await Post.findOne({_id: "000000000000000000000003"})
			.then(res => {
				comment = res.comments[0]
			})

			let token = await buildToken(preMockUser.username)

			return chai.request(app)
			.delete(`/comments/delete/${comment.id}`)
			.set('Authorization', `Bearer ${token}`)
			.set('Application', 'application/json')
			.set('Content-Type', 'application/json')
			.then(res => {
				expect(res).to.have.status(204)
			})

		});
	});

});


