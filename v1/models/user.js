const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: Number, required: true, default: 1},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true}
},{timestamps: true});
userSchema.index({name: "text"});   
userSchema.plugin(uniqueValidator);

userSchema.pre('save', async function (next) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.getSignedToken = function() {
    return jwt.sign({username: this.username, password: this.password, role: this.role}, process.env.accessTokenSecret, {expiresIn: 60*60}).toString();
};

var User = mongoose.model('User',userSchema);
module.exports = User;
