const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Post = require('./posts');

/*comment style schema */
const commentSchema = new Schema({
	userId: { type: ObjectId, ref: 'User' },
	postId: {type: ObjectId, ref: 'Post'},
	event: { type: ObjectId, ref: 'EventPlan', required: true },
	text: String
}, {
	timestamps: true
});

commentSchema.set('toJSON', {
	virtuals: true,     // include built-in virtual `id`
	transform: (doc, result) => {
		delete result._id;
		delete result.__v;
	}
});

commentSchema.virtual('listing').get(function () {
	return this.userId.fullname
});

commentSchema.post('save', function(next) {
	return Post.findByIdAndUpdate(this.postId, { $push: { 'comments': this.id }})
  .then(comment => {
	  next(comment)
  })
});


/*Can't seem to fire pre-remove depopulate */
// commentSchema.pre('remove', function(next) {
// 	console.log('harharhar')
// 	 return Post.findByIdAndUpdate(this.postId, { $pull: { 'comments': this.id }})
// 	.then(post => {
// 		next(post)
// 	})
// })

module.exports = mongoose.model('Comment', commentSchema)
