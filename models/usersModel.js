const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const bcrypt = require('bcryptjs')

/*User Schema */

const userSchema = new Schema({
  fullname: { type: String, require: true },
  username: { type: String, require: true, index: { unique: true } },
  password: { type: String, required: true },
  role: { type: String, require: true },
  attendanceVerdict: { type: String, require: true }
})

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

      console.log(hash, 11, user.password)
      user.password = hash;

      next()
    })
  })
})

userSchema.pre('findOneAndUpdate', function(next) {
  const password = this.getUpdate().$set.password;
  if(!password) {
    return next(err)
  }
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  this.getUpdate().$set.password = hash
  console.log(password, hash, 'hookHittin')
  next()
/*https://github.com/Automattic/mongoose/issues/4575 */
})

userSchema.methods.comparePassword = function (pwd, done) {

  bcrypt.compare(pwd, this.password, function (err, res) {
    console.log(res, 'rezzy')
    if (err) { return done(err) }
    if (res === false) { return done(false) }
    else return done(true)

  })

}

userSchema.methods.checkPass = function (pwd) {
  return bcrypt.compareSync(pwd, this.password)
}

// userSchema.methods.comparePassword = function(storedPass, done) {
//   bcrypt.compare(storedPass, this.password, function(err, isMatch) {
//     if(err) {return next(err)}
//     done(null, isMatch)
//   })
// }


userSchema.methods.serialize = function () {
  return {
    fullname: this.fullname,
    username: this.username,
    role: this.role
  }
};

userSchema.statics.checkUniquity = async function (userName, next) {

  let msg;
  var unique = await this.count({ username: userName })
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
  return unique;
};

module.exports = mongoose.model('User', userSchema)