const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcryptjs')

/*User Schema */

const userSchema = new Schema({
  fullname: {type: String, require: true},
  username: {type: String, require: true, index: { unique: true } },
  password: {type: String, required: true},
  role: {type: String, require: true}
})

userSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


/*http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt */
userSchema.pre('save', function(next) {
  var user = this /*this way we have a steady scope/range of usage(otherwise won't work to assign pwd at end of block) */

  if(!user.isModified('password')) { 
    return next()};

  bcrypt.genSalt(10, function(err, salt) {
    if(err) {return next(err)}
  
    bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) {
          return next(err)}

        console.log(hash, 11, user.password)
        user.password = hash;

        next()
      })
    })
})

userSchema.methods.comparePassword = function(storedPass, next) {
  bcrypt.compare(storedPass, this.password, function(err, isMatch) {
    if(err) {return next(err)}
    next(null, isMatch)
  })
}

// userSchema.methods.checkPass = function() {
//   return bcrypt.compare(this.password, pwd )
// }

userSchema.methods.serialize = function () {
  return {
    fullname: this.fullname,
    username: this.username,
    role: this.role
  }
};

// userSchema.statics.buildDigest = function (pass) {
//   return bcrypt.hash(pass, 10)
// };

// userSchema.statics.unHash = function (pass, hash) {
//   return bcrypt.compare(pass, hash)
// };


userSchema.statics.checkUniquity = async function (userName, next) {

  let msg;

  var tar = await this.count({ username: userName })
    .then(function (count) {
      console.log(`${count} is the count`)
      if (!(count === 0)) {
        msg = `${userName} already taken!!`
        console.log(msg)
        return Promise.reject({ message: msg })
      }
      return userName
    })
    .catch(function (error) {
      return Promise.reject({ message: msg })
    })
  return tar
    ;
}

module.exports = mongoose.model('User', userSchema)