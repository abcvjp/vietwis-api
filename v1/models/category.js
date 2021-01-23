const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const slugify = require('slugify');
const categorySchema = new Schema({
    name: {type: String, require: true, unique: true},
    slugId: {type: String, require: true, unique: true}
});
categorySchema.pre('validate', function() {
    if (this.isNew || this.isModified('name') && this.name) {
        this.slugId = slugify(this.name, {
            replacement: '-',
            lower: true,
            strict: true,
            locale: 'vi'
        });
    };
});
categorySchema.plugin(uniqueValidator);
var Category = mongoose.model('Category',categorySchema);
module.exports = Category;