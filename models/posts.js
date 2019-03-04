const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentPost = require('./comments');

/* Post style schema */
const postSchema = new Schema({
  title: String,
  author: { type: ObjectId, ref: 'User' },
  event: { type: ObjectId, ref: 'EventPlan' }, 
  body: String,
  comments: [{ type: ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

postSchema.set('toJSON', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
  }
});


postSchema.methods.serialize = function () {
  return {
    id: this.id,
    title: this.title,
    author: this.author.fullname,
    body: this.body,
    event: this.event,
    comments: this.comments,
    createdAt: this.createdAt
  }
};


function populatePost() {
  this.populate({ path: 'author' });
};

function populatePostList() {
  this.populate({ path: 'author' });
  this.populate({
    path: 'comments',
    populate: {
      path: 'userId',
      options: { select: { username: 0, id: 0 } }
    }
  });
};

postSchema.pre('find', populatePost);
postSchema.pre('findOne', populatePostList);


/*https://github.com/Automattic/mongoose/issues/3054 */
postSchema.pre('remove', function() {
  let arr = this.comments;
  
  for(let i = 0; i < arr.length; i++) {
    CommentPost.findByIdAndDelete(i)
  }

  arr.forEach(comment => {
    CommentPost.findByIdAndDelete(comment)
    })
    
});

module.exports = mongoose.model('Post', postSchema)