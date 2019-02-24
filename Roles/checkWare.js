const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const EventPlan = require('../models/events');

/*write express middleware here */

/*Allows eventAdmins and masterAdmin through */
var levelOne = function(req, res, next) {
    let role = req.user.role;

    if(!role) {
        return Promise.reject({message: 'No role detected', reason: 'Unauthorized'})
    }

    if(role === 0) {
        return next()
    }

    if(role !== 1) {
        console.log("level One Restriction: access denied!", 'current role', role)
        return Promise.reject({message: 'This account does not hold eventAdmin privileges', reason: 'Unauthorized'})
    }
    console.log("lvl1-pass")
    next()
};

/*Allows only masterAdmins through */
var levelTwo = function(req, res, next) {
    let role = req.user.role;

    if(!role) {
        return Promise.reject({message: 'No role detected', reason: 'Unauthorized'})
    }

    if(role !== 0) {
        console.log("level Two Restriction: access denied!", 'current role', role)
        return Promise.reject({message: 'This account does not hold masterAdmin privileges', reason: 'Unauthorized'})
    }
    console.log("lvl2-pass")
    next()
};









validateEvent = function (req, res, next) {

    
    let name = req.body.eventName

       return EventPlan.findOne({name: name}, function (err, event) {
          if (err) {
              let msg = 'eventValidation error!'
            console.log(msg)
            return Promise.reject({message: msg})
          }
          if (!name) {
              let msg = 'no name given'
            console.log(msg)
            return Promise.reject({message: msg})
          }
          if (!event) {
              let msg = 'no event found'
            console.log(msg)
            return res.json({message: 'false'}) 
            // Promise.reject({message: msg})
          }
          console.log('event found!')
          return next(null, event)
      })
  };

  checkEventName = function (req, res, next) {
    
    let name = req.body.name

       return EventPlan.findOne({name: name}, function (err, event) {
          if (err) {
              let msg = 'eventCheck error!'
            console.log(msg)
            return Promise.reject({message: msg})
          }
          if (!name) {
              let msg = 'No name is given'
            console.log(msg)
            return Promise.reject({message: msg})
          }
          if (event) {
            let msg = 'Event name already exists'
          console.log(msg)
          return Promise.reject({message: msg})
        }
          if (!event) {
              let msg = 'Event name not taken, success!'
            console.log(msg)
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
                console.log(msg)
                return Promise.reject({message: msg})
            }
            console.log('userId accepted!')
            return next(event)
        })
  };





module.exports = { levelOne, levelTwo, validateEvent, validateAttendance, checkEventName }