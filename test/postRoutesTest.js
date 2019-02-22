const chai = require('chai');
const chaitHttp = require('chai-http');
const expect = chai.expect;
const mongoose = require('mongoose');
const faker = require('faker');
const db = mongoose.connection;

const User = require('../models/usersModel');
const MONGODB_URI_TEST = require('../config');

chai.user(chaiHttp);

const { app, runServer, closeServer } = require('../server');

