const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
// const Post = require('./postsModel')

const  localStrategy = require('./local')

const passport = require('passport');
passport.use('local', localStrategy)

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json())
router.use(express.static('./views'))

router.get('/', (req, res) => {
    console.log('got to the Loggin Rodeo sun!')
    res.status(201)
})

router.post('/', localAuth, (req, res) => {
    console.log('maider This farm!')
    
} )

module.exports = router;
