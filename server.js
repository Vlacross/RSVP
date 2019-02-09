
require('dotenv').config(); /*https://www.npmjs.com/package/dotenv */
const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const { User, Post, Comments } = require('./models')
const { authRouter } = require('./auth')

const passport = require('passport')
const LocalStrategy = require('passport-local')


const app = express()

app.use(express.static('./views'))

app.use('/loggin', authRouter)

app.get('/', function(req, res) {
        console.log("obtained GET route")
        res.status(200).end()

    });

app.post('/', jsonParser, function(req, res) {

console.log('authenticatin', req.body)
res.status(200).end()
})









/*allot space for testing runServer/closeServer*/

 app.all('/*', function() {
     /* catch-all - http://expressjs.com/en/4x/api.html#app.all */
     console.log('no such location!')
     res.status(501)
 })

app.listen(8080)
