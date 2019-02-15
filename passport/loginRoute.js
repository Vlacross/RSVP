const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const  localStrategy = require('./local')
const passport = require('passport');
passport.use('local', localStrategy)
const localAuth = passport.authenticate('local', {session: false});

const { JWT_SECRET, ALG, EXP } = require('../config')

const opts = {
    algorithm: ALG,
    // iat: new Date(),
    expiresIn: EXP
}
const buildToken = function(user) {
    return jwt.sign({user}, JWT_SECRET, opts
    )
}

router.use(bodyParser.json())
router.use(express.static('./views'))

router.get('/', (req, res) => {
    console.log('got to the Loggin Rodeo sun!')
    
    res.status(201)
})

router.post('/', localAuth, (req, res) => {
    console.log('maider This farm!', JWT_SECRET)
    let token = buildToken(req.user.serialize())
    res.json({token: token})
} )

module.exports = router;
