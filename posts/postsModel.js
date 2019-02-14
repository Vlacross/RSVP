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

/*maybe make two serialize one for listing all posts, another for individual post selection */
postSchema.methods.serialize = function() {
  return {
    title: this.title,
    author: this.author.fullname,
    body: this.body,
    comments: this.comments
  }
}

function populatePost() {
  this.populate({path: 'author'});
  this.populate({
    path: 'comments',
    populate: {path: 'userId',
               options: {select: {username: 0, id: 0}}}
            });
};

postSchema.pre('find', populatePost)
postSchema.pre('findOne', populatePost)

// postSchema.pre('find', populateComments)

module.exports = mongoose.model('Post', postSchema)