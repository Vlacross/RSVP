const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const Router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')


// Router.use('*', jsonParser)

Router.get('/', function(req, res) {
    console.log('herego!')
})

Router.post('/', function(req, res) {
    console.log('AuthPosters', req.body)
})




const checkToken = (req, res, next) => {
    /*https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4 */
    
}

// const checkHeaders = (req, res, next) => {
//     if(!req.body.userName || !req.body.passWord) {
//         console.log('missing username or password')
//         next();
//     }

// }


module.exports =  Router