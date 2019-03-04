const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const jwtStrategy = require('../passport');
const passport = require('passport');
passport.use('JWT', jwtStrategy);
const jwtAuth = passport.authenticate('JWT', { session: false });

const EventPlan = require('../models/events');


router.use(bodyParser.json());
router.use('*', jwtAuth);


router.get('/find/:id', (req, res) => {
	EventPlan.findOne({_id: req.params.id})
		.then(event => {
			res.json(event.serialize())
		})
});




module.exports = router


