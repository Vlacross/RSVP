const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
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


var nameOnlyEvent = {
	name: 'eventless'
};

var mockEvent = {
	name: 'mockEvent',
	host: 'mockHost',
	dateOfEvent: new Date(),
	contactInfo: 'mock@mock.com',
	summary: 'mockSummary'
};

var existingEvent = {
	name: 'demoEvent',
	host: 'benji',
	datOfEvent: 'day after sept 41st',
	contactInfo: 'benjo@bens.jee',
	summary: 'get together about event related apps'
};

var emptyEvent = {};

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

var mockEmptyUser = {};



var whiteSpaceStart = {
	eventName: " spaceStart"
};

var whiteSpaceEnd = {
	eventName: "whiteSpaceEnd "
};

var existingEventName = {
	eventName: "demoEvent"
};

var nonExistantEventName = {
	eventName: "invalid"
};



/********************************************************************************************************************************USER*CREATE************* */


describe('User route actions', function () {

	before(function () {
		console.log('mounting DB: ', MONGODB_URI_TEST)
		return mongoose.connect(MONGODB_URI_TEST, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

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

	
	describe('User Create field validation', function () {


		it('shuold prove Unit functions properly', function () {
			return User.find()
				.then(function (res) {
					expect(res).to.be.an('array')
				})
		});

		it('should deny a username in use', function () {

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

		it('should return Promise reject stating missing fields', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockEmptyUser)
				.then(res => {
					expect(res).to.be.an('object')
					expect(res.body.code).to.eql(422)
					expect(res.body.message).to.eql('Missing fullname,username,password,event,role,attending in header!')
				})
		});

		it('should reject username under 5 letters', function () {
			mockUser.username = 'user'

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res).to.be.an('object')
					expect(res.body.code).to.be.eql(422)
					expect(res.body.message).to.eql('Username must be between 5-14 characters')
				})
		});

		it('should reject username over 15 letters', function () {
			mockUser.username = 'fifteenLettersO'

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res).to.be.an('object')
					expect(res.body.code).to.be.eql(422)
					expect(res.body.message).to.eql('Username must be between 5-14 characters')
				})
		});

		it('should perform an integration test', function () {
			mockUser.username = 'mockUser'
			return chai.request(app)
				.get('/users')
				.then(function (res) {
					expect(res.text).to.be.eql('Unauthorized')
				})
		});

	});


	describe('user create success', function () {


		it('should create a new user', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res).to.have.status(200)
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

		it('should return token in form of string', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res.body.token).to.be.a('string')
				})
		});

		it('should return user data in an object', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res.body.user).to.be.an('object')
					expect(res.body.user).to.contain.keys('username', 'fullname', 'event', 'attending', 'joinDate', 'role', 'id')
				})
		});

		it('should return user data matching submited data', function () {

			return chai.request(app)
				.post('/login/create')
				.send(mockUser)
				.then(res => {
					expect(res.body.user.username).to.be.eql(mockUser.username)
					expect(res.body.user.fullname).to.be.eql(mockUser.fullname)
					expect(res.body.user.event).to.be.eql(mockUser.event)
					expect(res.body.user).to.not.contain.keys('password')
				})
		});

	})
	/********************************************************************************************************************************USER*CREATE************* */

	/********************************************************************************************************************************USER*LOGIN************* */


	// describe('user login fail', function () {



	// 	it('should return fail with bad username', function () {

	// 		return chai.request(app)
	// 			.post('/login/')
	// 			.send(badUsername)
	// 			.then(res => {
	// 				expect(res).to.has.status(401)
	// 				expect(res.text).to.eql('Unauthorized')
	// 			})
	// 	});

	// 	it('should return fail with bad password', function () {

	// 		return chai.request(app)
	// 			.post('/login/')
	// 			.send(badPassword)
	// 			.then(res => {
	// 				expect(res).to.has.status(401)
	// 				expect(res.text).to.eql('Unauthorized')
	// 			})
	// 	});

	// });

	
	// describe('user login success', function () {

	// 	it('should return success status', function () {

	// 		return chai.request(app)
	// 			.post('/login/')
	// 			.send(existingUser)
	// 			.then(res => {
	// 				expect(res).to.have.status(200)
	// 				expect(res.body).to.contain.keys('token', 'userData')
	// 				expect(res.body.token).to.be.a('string')
	// 				expect(res.body.userData).to.be.an('object')
	// 				expect(res.body.userData).to.contain.keys('username', 'fullname', 'event', 'attending', 'joinDate', 'role', 'id')
	// 				expect(res.body.userData.username).to.be.eql(existingUser.username)
	// 				expect(res.body.userData).to.not.contain.keys('password')
	// 			})
	// 	});



		// 	// Maybe a Race issue of some sort causing first to pass and the rest to finally. maybe needs a delay in line?
		// 	/*not hitting 'comparePass' method in userSchema file */

		// 	it('should return a token and user data obj', function () {
		// 		return chai.request(app)
		// 			.post('/login/')
		// 			.send(existingUser)
		// 			.then(res => {
		// 				expect(res.body).to.contain.keys('token', 'userData')
		// 				expect(res.body.token).to.be.a('string')
		// 			})
		// 	});

		// 	it('should return proper user data in form of an object', function () {
		// 		return chai.request(app)
		// 			.post('/login/')
		// 			.send(existingUser)
		// 			.then(res => {
		// 				expect(res.body.userData).to.be.an('object')
		// 				expect(res.body.userData).to.contain.keys('username', 'fullname', 'event', 'attending', 'joinDate', 'role', 'id')
		// 			})
		// 	});

		// 	it('should return proper user data', function () {


		// 		return chai.request(app)
		// 		.post('/login/')
		// 		.send(existingUser)
		// 		.then(res => {
		// 			console.log(res.body)
		// 			expect(res).to.have.status(200)
		// 			expect(res.body).to.contain.keys('token', 'userData')
		// 			expect(res.body.token).to.be.a('string')
		// 			expect(res.body.userData).to.be.an('object')
		// 			expect(res.body.userData).to.contain.keys('username', 'fullname', 'event', 'attending', 'joinDate', 'role', 'id')
		// 			expect(res.body.userData.username).to.be.eql(existingUser.username)
		// 			expect(res.body.userData).to.not.contain.keys('password')
		// 		})
		// 	});

		// 	it('should return success status', function () {

		// 		return chai.request(app)
		//       .post('/login/')
		// 			.send(existingUser)
		// 			.then(res => {
		// 				expect(res.body.userData.username).to.be.eql(existingUser.username)
		// 				expect(res.body.userData).to.not.contain.keys('password')
		// 			})
		// 	})

	// });

	/********************************************************************************************************************************USER*LOGIN************* */

	/***************************************************************************************************************************'local-strategy' *****CHECK*EVENT************* */


	describe('event name validation', function () {


		it('should fail when event name starts with whiteSpace', function () {

			return chai.request(app)
				.post('/login/eventCheck')
				.send(whiteSpaceStart)
				.then(res => {
					expect(res).to.have.status(422)
					expect(res.body.message).to.be.eql('WhiteSpace found in credentials! Username and password can\'t start or end with a space!')
				})
		});

		it('should fail when event name ends with whiteSpace', function () {

			return chai.request(app)
				.post('/login/eventCheck')
				.send(whiteSpaceEnd)
				.then(res => {
					expect(res).to.have.status(422)
					expect(res.body.message).to.be.eql('WhiteSpace found in credentials! Username and password can\'t start or end with a space!')
				})
		});

		it('should return status 200 and message of false', function () {

			return chai.request(app)
				.post('/login/eventCheck')
				.send(nonExistantEventName)
				.then(res => {
					expect(res).to.have.status(200)
					expect(res.body.message).to.eql('false')
				})
		});

		it('should return status 200 and message of success', function () {

			return chai.request(app)
				.post('/login/eventCheck')
				.send(existingEventName)
				.then(res => {
					expect(res).to.have.status(200)
					expect(res.body.message).to.eql('true')
					expect(res.body).to.contain.keys('message', 'event')
				})
		});

		it('should return sufficient, matching data based on given name', function () {

			return chai.request(app)
				.post('/login/eventCheck')
				.send(existingEventName)
				.then(res => {
					expect(res.body.event.name).to.eql(existingEventName.eventName)
					expect(res.body.event).to.contain.keys('attendees', 'name', 'host', 'dateOfEvent', 'contactInfo', 'summary', 'createdAt', 'id')
				})
		});


	})




	/********************************************************************************************************************************CHECK*EVENT************* */


	/********************************************************************************************************************************CHECK*EVENT************* */

	describe('new event validation', function () {


		it('should perform a Unit test', function () {

			return EventPlan.find()
				.then(function (res) {
					expect(res).to.be.an('array')
				})
		});

		it('should deny an event name in use', function () {

			return chai.request(app)
				.post('/login/newEvent')
				.send(mockEvent)
				.then(res => {
					return chai.request(app)
						.post('/login/newEvent')
						.send(mockEvent)
						.then(res => {
							expect(res).to.have.status(422)
							expect(res).to.be.an('object')
							expect(res.body.message).to.eql('Event name already exists')
						})
				})
		});

		it('should deny empty obj', function () {

			return chai.request(app)
				.post('/login/newEvent')
				.send(emptyEvent)
				.then(res => {
					expect(res).to.has.status(400)
					expect(res.body.message).to.eql('No name is given')
				})
		});

		it('should return rejection stating missing fields', function () {

			return chai.request(app)
				.post('/login/newEvent')
				.send(nameOnlyEvent)
				.then(res => {
					expect(res).to.have.status(422)
					expect(res.body.message).to.eql('Missing host,dateOfEvent,contactInfo,summary in header!')
				})
		});

	});

	describe('new event create', function () {



		it('should create a new event and return event data', function () {

			return chai.request(app)
				.post('/login/newEvent')
				.send(mockEvent)
				.then(res => {
					expect(res).to.have.status(200)
					expect(res.body).to.be.an('object')
					expect(res.body).to.contain.keys('id', 'name', 'host', 'dateOfEvent', 'contactInfo', 'attendees', 'createdAt', 'summary')
					expect(res.body.name).to.eql(mockEvent.name)
				})
		});


	});


});

/********************************************************************************************************************************CHECK*EVENT************* */











