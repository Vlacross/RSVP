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

commentSchema.post('save', function() {
	Post.findByIdAndUpdate(this.postId, { $push: { 'comments': this.id }})
  .then(comment => {
    console.log(comment)
  })
});

commentSchema.pre('remove', function() {
	console.log('harharhar')
	Post.findByIdAndUpdate(this.postId, { $pull: { 'comments': this.id }})
  
 
})

module.exports = mongoose.model('Comment', commentSchema)