const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const bcrypt = require('bcryptjs');

const EventPlan = require('./events');

/*User Schema */
const userSchema = new Schema({
  fullname: { type: String, require: true },
  username: { type: String, require: true, index: { unique: true } },
  password: { type: String, required: true },
  event: { type: ObjectId, ref: 'EventPlan', required: true }, 
  role: { type: Number, default: 2, require: true },
  attending: { type: Boolean, require: true }
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

/*http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt */
userSchema.pre('save', function (next) {
  var user = this /*this way we have a steady scope/range of usage(otherwise won't work to assign pwd at end of block) */

  if (!user.isModified('password')) {
    return next()
  };

  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err) }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err)
      }

      user.password = hash;

      next()
    })
  })
});

userSchema.pre('find', function() {
  this.populate({ path: 'event' });
});

/*adding user reference from event record */
userSchema.post('save', function() {

  EventPlan.findByIdAndUpdate(this.event, { $push: { 'attendees': this.id }})
  .then(event => {
  })
});

/*removing user reference from event record */
userSchema.post('remove', function() {
  EventPlan.findByIdAndUpdate(this.event, { $pull: { 'attendees': this.id }})
  .then(event => {
  })
});


/*hashes user password on update */
userSchema.pre('findOneAndUpdate', function(next) {

  const password = this.getUpdate().$set.password;
    if(!password) {
      return next()
    }
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  this.getUpdate().$set.password = hash
  next()
/*https://github.com/Automattic/mongoose/issues/4575 */
});

/*password check */
userSchema.methods.checkPass = function(pwd) {
  return bcrypt.compareSync(pwd, this.password)
};

userSchema.methods.serialize = function () {
  return {
    id: this.id,
    fullname: this.fullname,
    username: this.username,
    event: this.event,
    attending: this.attending,
    joinDate: this.createdAt,
    role: this.role
  }
};

module.exports = mongoose.model('User', userSchema)