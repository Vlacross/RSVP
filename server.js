const express = require('express');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const mongoose = require('mongoose')

const { MONGODB_URI, PORT } = require('./config')
const { User, Post, Comments } = require('./models')
const { localStrategy, jwtStrategy } = require('./passport');

const { rsvpRouter } = require('./appHome')

const app = express()

const passport = require('passport');
passport.use('JWT', jwtStrategy)
passport.use('local', localStrategy)

const localAuth = passport.authenticate('local', {session: false});
const jwtAuth = passport.authenticate('jwt')



app.use(jsonParser)
app.use(express.static('./views'))

app.use('/home', rsvpRouter)

app.get('/len', localAuth, function(req, res) {
	console.log("obtained root route")
	res.status(207).end()
	
});



/**/
let server;

function runServer() {
		mongoose.connect(MONGODB_URI, {useNewUrlParser: true, autoIndex: false}, err => {
			if(err) {
				console.log(err,)
				reject(err)
			} 
			server = app.listen(PORT, () => {
				console.log(`App is slistening on port ${PORT}`)
			})
			console.log(`connected to ${MONGODB_URI}`)
		
			})	
}

function closeServer() {
	return mongoose.disconnect()
	.then(function(conn) {
		server.close()
	})
	.catch(err => console.log(err))

}


 app.all('/*', function() {
     /* catch-all - http://expressjs.com/en/4x/api.html#app.all */
     console.log('no such location!')
     res.status(501)
 })


 /*https://nodejs.org/api/modules.html#modules_accessing_the_main_module */
if(require.main === module ) {
runServer()
}
