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

var mockEvent = {
    name: 'mockEvent',
    host: 'mockHost',
    dateOfEvent: new Date(),
    contactInfo: 'mock@mock.com',
    summary: 'mockSummary'
}


var mockUser = {
	fullname: 'mockFull',
	username: 'mockUser',
    password: 'mockPass',
    event: '242424242424242424242424',
	role: 3,
	attending: true
};

var mockEmptyUser = {};

/********************************************************************************************************************************USER*CREATE************* */

/*User create fails work properly        */
describe('user Create field validation', function () {

	testHooks()

	it('should perform a Unit test', function () {

		return User.find()
			.then(function (res) {
				expect(res).to.be.an('array')
			})
	});

	it('should deny a username in use', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			return chai.request(app)
			.post('/login/create')
			.send(mockUser)
			.then(res => {
				expect(res).to.be.an('object')
				expect(res.body.code).to.eql(422)
				expect(res.body.message).to.eql('username already in use!')
			})
        })
	});

	it('should return Promise reject stating missing fields', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockEmptyUser)
        .then(res => {
			expect(res).to.be.an('object')
			expect(res.body.code).to.eql(422)
			expect(res.body.message).to.eql('Missing fullname,username,password,event,role,attending in header!')
        })
	});

	it('should reject username under 6 letters', function() {
		mockUser.username = 'user'

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res).to.be.an('object')
			expect(res.body.code).to.be.eql(422)
			expect(res.body.message).to.eql('Username must be between 6-14 characters')
        })
	});

	it('should reject username over 15 letters', function() {
		mockUser.username = 'fifteenLettersO'

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res).to.be.an('object')
			expect(res.body.code).to.be.eql(422)
			expect(res.body.message).to.eql('Username must be between 6-14 characters')
        })
	});

	it('should perform an integration test', function () {
		return chai.request(app)
			.get('/users')
			.then(function (res) {
				expect(res.text).to.be.eql('Unauthorized')
			})
	})

})

/*user create success works properly */
describe('user create success', function() {

	testHooks()

	it('should create a new user', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
            expect(res).to.have.status(200)
        })
	});

	
	it('should return token and user data', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res.body).to.include.keys('token', 'user')
        })
	});

	it('should return token in form of string', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res.body.token).to.be.a('string')
        })
	});

	it.only('should return user data in an object', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res.body.user).to.be.an('object')
			expect(res.body.user).to.contain.keys('username', 'fullname', 'event', 'attending', 'joinDate', 'role', 'id')
        })
	});

	it('should return user data matching submited data', function() {

        return chai.request(app)
        .post('/login/create')
        .send(mockUser)
        .then(res => {
			expect(res.body.user.username).to.be.eql(mockUser.username)
			expect(res.body.user.fullname).to.be.eql(mockUser.fullname)
			expect(res.body.user.event).to.be.eql(mockUser.event)
			expect(res.body.user).to.not.contain.keys('password')
        })
	})

})
/********************************************************************************************************************************USER*CREATE************* */















