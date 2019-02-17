const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId


/*comment style schema */

const commentSchema = new Schema({
	userId: { type: ObjectId, ref: 'User' },
	text: String
})

commentSchema.set('toJSON', {
	virtuals: true,     // include built-in virtual `id`
	transform: (doc, result) => {
		delete result._id;
		delete result.__v;
	}
});

commentSchema.virtual('listing').get(function () {
	return this.userId.fullname
})


// function populateAuthor() {
//   this.populate('author');
// };

// function populateComments() {
//   this.populate('comments')
// }

// commentSchema.pre('find', populateAuthor)
// commentSchema.pre('findOne', populateAuthor)


module.exports = mongoose.model('Comment', commentSchema)