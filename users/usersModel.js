const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/*User Schema */

const userSchema = new Schema({
  fullname: String,
  username: String,
  role: String
})

userSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


// userSchema.pre('save', () => {
// console.log(this)
// })

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


userSchema.methods.serialize = function () {
  return {
    fullname: this.fullname,
    username: this.username,
    role: this.role
  }
};

userSchema.statics.buildDigest = function (pass) {
  return bcrypt.hash(pass, 10)
};

userSchema.statics.unHash = function (pass) {
  return bcrypt.hash(pass, 10)
};


module.exports = mongoose.model('User', userSchema)