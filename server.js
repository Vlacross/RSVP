const express = require('express');
const bodyParser = require('body-parser')

const app = express()

app.use(express.static('/views'))

app.get('/Home', function(req, res) {
        console.log("obtained GET route")

    });
    



/*allot space for testing runServer/closeServer*/

app.all('*', function() {
    /* catch-all - http://expressjs.com/en/4x/api.html#app.all */
    res.status(501)
})
