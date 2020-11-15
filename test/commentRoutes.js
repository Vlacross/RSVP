const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');

const { MONGODB_URI_TEST } = require('../config');
const { connectDatabase, disconnectDatabase, seedDatabase, buildToken } = require('../utils/dbActions');
const { User, EventPlan, Post, Comment } = require('../models');

chai.use(chaiHttp);

const { app } = require('../server');


describe('Comment routes actions', function() {


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


	describe('Comment route basic interactions', function () {

	

		it('should prove unit functions', async function () {
	
			return await Comment.find()
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

			var mockComment = {
				text: 'mockText'
			};

			let token;

			await EventPlan.findOne({name: 'demoEvent'})
			.then(res => {
				mockComment.event = res.id	
			})
			await Post.findOne({event: mockComment.event})
			.then(res => {
				mockComment.postId = res.id
			})
			await User.findOne({event: mockComment.event})
			.then(async res => {
				mockComment.userId = res.id;
				token = await buildToken(res.username)
			})

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

			let token;

			let comment;
			await Post.findOne({_id: "000000000000000000000003"})
				.then(res => {
					comment = res.comments[0]
				})
				.catch(err => {
					console.log(err)
				});

			await User.findOne({_id: "333333333333333333333301"})
				.then(async res => {
					token = await buildToken(res.username)
				})
				.catch(err => {
					console.log(err)
				});

			return await chai.request(app)
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


