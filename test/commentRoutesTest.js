const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const DB = mongoose.connection;

const MONGODB_URI_TEST = require('../config');

const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const Comments = require('../models/commentsModel');

const seedPosts = require('../db/posts');
const seedUsers = require('../db/users');
const seedComments = require('../db/comments');


// chai.use(chaiHttp)


const { app } = require('../server');

function testHooks() {
	
	beforeEach(function () {
		mongoose.connect(MONGODB_URI_TEST, { useNewUrlParser: true })
			.then(() => {
				console.info('Dropping Database');
				return DB.db.dropDatabase();
			})
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

