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
    attendees: [{ type: ObjectId, ref: 'User' }],
    summary: String
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
      host: this.host,
      dateOfEvent: this.dateOfEvent,
      contactInfo: this.contactInfo,
      attendees: this.attendees,
      createdAt: this.createdAt,
      summary: this.summary
    }
  };


  module.exports = mongoose.model('EventPlan', eventSchema)





