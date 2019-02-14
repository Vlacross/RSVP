const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


/*comment style schema */

const commentSchema = new Schema ({
    user: {type: ObjectId, ref: 'Users'},
    text: String
})

commentSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


module.exports = mongoose.model('Comments', commentSchema)