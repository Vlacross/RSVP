const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');
const morgan = require('morgan')

const app = express();

const { MONGODB_URI, PORT } = require('./config');
const { CommentRoutes, UserRoutes, PostRoutes, EventRoutes } = require('./routes');
const { localStrategy, jwtStrategy, AuthRoute } = require('./passport');


const passport = require('passport');
passport.use('JWT', jwtStrategy);
passport.use('local', localStrategy);

const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('JWT', { session: false });

app.use(jsonParser);
app.use('/login', AuthRoute);
app.use(express.static('public'));
app.use('/comments', CommentRoutes);
app.use('/users', UserRoutes);
app.use('/posts', PostRoutes);
app.use('/events', EventRoutes);
app.use(morgan(
	process.env.NODE_ENV === 'development' ? 'dev' : 'tiny',
	{
		skip: () => process.env.NODE_ENV === 'test'
	}
));



let server;

function runServer() {
	mongoose.connect(MONGODB_URI, { 
		useUnifiedTopology: true, 
		useNewUrlParser: true, 
		useFindAndModify: false, 
		useCreateIndex: true, 
		autoIndex: false }, err => {
		if (err) {
			console.log(err)
			reject(err)
		}
		server = app.listen(PORT, () => {
			console.log(`App is slistening on port ${PORT}`)
		})
		console.log(`connected to ${MONGODB_URI}`)

	})
};

function closeServer() {
	return mongoose.disconnect()
		.then(function (conn) {
			server.close()
		})
		.catch(err => console.log(err))

};

/*https://nodejs.org/api/modules.html#modules_accessing_the_main_module */
if (require.main === module) {
	runServer()
};

module.exports = { app, runServer, closeServer }

