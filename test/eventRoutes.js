const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');

const { MONGODB_URI_TEST } = require('../config');
const { connectDatabase, disconnectDatabase, seedDatabase, buildToken } = require('../utils/dbActions');
const { EventPlan, User } = require('../models');


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

describe('Event routes actions', function() {


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

		
		it('should find an event by id', async function() {

				let eventId;
				let token;
				
				await EventPlan.findOne({_id: "242424242424242424242424"})
					.then(res => {
						eventId = res.id
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
						.catch(err => console.log(err))
						
				})
	});

});












