const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
    username: {type: String},
    email: {type: String, required: true},
    name: {type: String, required: true},
    content: {type: String, required: true},
    website: {type: String},
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
},{timestamps: true});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;