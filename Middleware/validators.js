const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const EventPlan = require('../models/events');
const User = require('../models/users');

/*write express middleware here */
validateEvent = function (req, res, next) {

    let name = req.body.eventName

	if (!name) {
		msg = {
			code: 422,
			message: `Missing Event Name in header!`
		}
		return res.status(422).json(msg).end()
  }
  
  if(name.trim() !== name) {
		let msg = {
			code: 422,
			message: "WhiteSpace found in credentials! Username and password can't start or end with a space!",
			reason: 'WhiteSpace found in user/pass'}
		return res.status(422).json(msg).end()
	}

       return EventPlan.findOne({name: name}, function (err, event) {
          if (err) {
              let msg = 'eventValidation error!'
            return Promise.reject({message: msg})
          }
          if (!name) {
              let msg = 'no name given'
            return Promise.reject({message: msg})
          }
          if (!event) {
              let msg = 'no event found'
            return res.json({message: 'false'}) 
            // Promise.reject({message: msg})
          }
          return next(null, event)
      })
  };

  checkEventName = function (req, res, next) {
    
    let name = req.body.name

       return EventPlan.findOne({name: name}, function (err, event) {
          if (err) {
              let msg = 'eventCheck error!'
            return Promise.reject({message: msg})
          }
          if (!name) {
              let msg = 'No name is given'
            return res.status(400).json({message: msg})
          }
          if (event) {
            let msg = 'Event name already exists'
          return res.status(422).json({message: msg})
        }
          if (!event) {
              let msg = 'Event name not taken, success!'
            return next()
          }
          
      })
  };

  validateAttendance = function (req, res, next) {
    let name = req.body.eventName
    let userId = req.body.id

       return EventPlan.findOne({name: name}, function(err, event) {


            let match = [];
            event.attendees.forEach(attendee => {
                if(attendee.toString() === userId) {
                    match.push(userId)
                }
            })
            if(match.length === 0) {
                let msg = 'no record of user at this event!'
                return Promise.reject({message: msg})
            }
            return next(event)
        })
  };

  checkUsername = function(req, res, next) {
    let user = req.body.username

    return User.findOne({username: user}, function(err, user) {
      if (err) {
        let msg = 'usernameCheck error!'
      return Promise.reject({message: msg})
      }
      if(user) {
        let msg = {
          code: 422,
          message: "username already in use!",
          reason: 'username is already in use'}
        return res.status(422).json(msg).end()
      }
    return next()

    })

  };


module.exports = { validateEvent, validateAttendance, checkEventName, checkUsername }
