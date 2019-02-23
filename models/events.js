const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/*May need to populate if need to show list of attendees?? */


/* Event style schema */
const eventSchema = new Schema({
    name: String,
    host: String,
    dateOfEvent: String,
    contactInfo: String,
    attendees: [{ type: ObjectId, ref: 'User' }]
  }, {
    timestamps: true
  });
  
  eventSchema.set('toJSON', {
    virtuals: true,     // include built-in virtual `id`
    transform: (doc, result) => {
      delete result._id;
      delete result.__v;
    }
  });


  eventSchema.methods.serialize = function () {
    return {
      id: this.id,
      name: this.name,
      dateOfEvent: this.dateOfEvent,
      contactInfo: this.contactInfo,
      attendees: this.attendees,
      createdAt: this.createdAt
    }
  };




  // validateEvent = function (req, res, next) {
    
  //   let name = req.body.eventName

  //      EventPlan.findOne({name: name}, function (err, event) {
  //         if (err) {
  //           console.log('eventValidation error!', err)
  //           return next(err, null)
  //         }
  //         if (!event) {
  //           console.log('no event found')
  //           return next(null, null)
  //         }
  //         console.log('event found!')
  //         return next(null, event)
  //     })
  // };

 


  module.exports = mongoose.model('EventPlan', eventSchema)





