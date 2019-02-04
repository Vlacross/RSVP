const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId



/*User Schema */

const userSchema = new Schema ({
    name: String,
    role: String
})


/* Post style schema */

const postSchema = new Schema({
    title: String,
    author: {type: ObjectId, ref: 'Author'},
    body: String,
    comments: {type: ObjectId, ref: 'Comments'}
})

/*comment style schema */

const commentSchema = new Schema ({
    user: {type: ObjectId, ref: 'Users'},
    text: String
})