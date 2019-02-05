const express = require('express');
const bodyParser = require('bodyParser')

const app = express()

app.use(express.static('/views'))

app.route('/')
    .get(function(req, res) {

    })

    .post(function(req, res) {

    })

    .put(function(req, res) {

    })

    .delete(function(req, res) {
        
    })



/*allot space for testing runServer/closeServer*/

app.all('*', function() {
    /* catch-all - http://expressjs.com/en/4x/api.html#app.all */
    res.status(501)
})
