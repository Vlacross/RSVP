const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


/* Post style schema */

const postSchema = new Schema({
    title: String,
    author: {type: ObjectId, ref: 'User'},
    body: String,
    comments: [{type: ObjectId, ref: 'Comment'}]
});

postSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});

module.exports = mongoose.model('Post', postSchema)