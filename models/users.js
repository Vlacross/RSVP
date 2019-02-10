const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

/*User Schema */

const userSchema = new Schema ({
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


module.exports = mongoose.model('User', userSchema)