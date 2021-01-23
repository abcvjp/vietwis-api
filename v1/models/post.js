const mongoose = require('mongoose');
const commentSchema = require('./comment.js').commentSchema;
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');

const postSchema = new Schema({
    title: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    slugId: {type: String, required: true, unique: true},
    isApproved: {type: Boolean, required: true, default: false},
    tags: [{type: String}],
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    rate: {type: Number, min: 0.0, max: 5.0},
    views: {type: Number, min: 0, default: 0},
    images: [String],
    comments_id: [{type: Schema.Types.ObjectId, ref: 'comment'}]
},{timestamps: true});

postSchema.index({title: "text", tags: "text"});

postSchema.pre('validate', function() {
    if (this.isNew || this.isModified('title') && this.title) {
        this.slugId = slugify(this.title, {
            replacement: '-',
            lower: true,
            strict: true,
            locale: 'vi'
        });
    };
});
postSchema.plugin(uniqueValidator);

var Post = mongoose.model('Post',postSchema);
module.exports = Post;