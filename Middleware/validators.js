const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const EventPlan = require('../models/events');
const User = require('../models/users');

/*write express middleware here */
let validateEventName = function (req, res, next) {

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



  
  let validateUserDetails = function(req, res, next) {
    
    let returnPackage = {
      fullname: req.body.fullname || '',
      username: req.body.username || '',
      event: req.body.event || '',
      role: req.body.role || '',
      attending: req.body.attending || ''
    }
    
    const requiredFields = ['fullname', 'username', 'password', 'event', 'role', 'attending']
    let missing = requiredFields.filter(field => (!req.body[field]))
    if (missing.length > 0) {
      msg = {
        code: 422,
        message: `Missing ${missing} in header!`,
        reason: `Missing ${missing} in header!`,
        details: returnPackage,
        attending: req.body.attending || ''
      }
		return res.status(400).json(msg).end()
	}

	const trimmed = ['username', 'password'];
	let untrimmed = trimmed.find(field => req.body[field].trim() !== req.body[field])
	if(untrimmed) {
    let msg = {
      code: 422,
			message: "whiteSpace found in credentials! Username and password can't start or end with a space!",
      reason: 'whiteSpace found in user/pass',
      details: returnPackage,
      attending: req.body.attending || ''
    }
      return res.status(400).json(msg).end()
	}
	
  const { fullname: full, username: user, password: pass, event, role, attending } = req.body
  


	if(user.length <= 4 || user.length >= 15) {
    let msg = {
			code: 422,
			message: 'Username must be between 5-14 characters',
      reason: 'Username must be between 5-14 characters',
      details: returnPackage,
      attending: req.body.attending || ''
    }
		return res.status(422).json(msg).end()
	}

	
	if(pass.length <=4 || pass.length >= 43) {
		let msg = {
			code: 422,
			message: 'Password must be between 5-42 characters',
      reason: 'Password must be between 5-42 characters',
      details: returnPackage,
      attending: req.body.attending || ''
    }
		return res.status(422).json(msg).end()
  }
  
  return next()

}

  let checkEventName = function (req, res, next) {
    
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

  let validateAttendance = function (req, res, next) {
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

  let checkUsername = function(req, res, next) {
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


module.exports = { validateEventName, validateAttendance, checkEventName, checkUsername, validateUserDetails }
