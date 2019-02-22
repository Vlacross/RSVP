const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const DB = mongoose.connection;
const bcrypt = require('bcryptjs')

const { MONGODB_URI_TEST } = require('../config');

const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const Comments = require('../models/commentsModel');

const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');


chai.use(chaiHttp)


const { app } = require('../server');

function testHooks() {
	
console.log(MONGODB_URI_TEST)
	before(function() {
		console.log('mounting DB')
		return	mongoose.connect(MONGODB_URI_TEST, { useNewUrlParser: true })
		
	})
	beforeEach(function () {
		
		console.info('Dropping Database');
	return	mongoose.connection.db.dropDatabase()	
		.then(() => {
			return Promise.all(seedUsers.map(user => bcrypt.hash(user.password, 10)));
		})
		.then((digests) => {
			seedUsers.forEach((user, i) => user.password = digests[i]);
			console.log('Seeding database')
			return Promise.all([
				Post.insertMany(seedPosts),
				User.insertMany(seedUsers),
				Comments.insertMany(seedComments),
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

describe('user login', function() {

	testHooks()

	it('should perform a Unit test', function() {

		return User.find()
		.then(function(res) {
			expect(res).to.be.an('array')
		})
	})

	it.only('should perform an integration test', function() {
		return chai.request(app)
		.get('/users')
		.then(function(res) {
			console.log(res.text)
			expect(res.text).to.be.eql('Unauthorized')
		})
	})

})














