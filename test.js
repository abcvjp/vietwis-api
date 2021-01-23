const mongoose = require('mongoose');
require('dotenv').config();
const Category = require('./v1/models/category');
const User = require('./v1/models/user');
const Post = require('./v1/models/post');
const comment = require('./v1/models/comment');
const DB_URI = process.env.DB_URI;
async function doit() {
    try {
        await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log('connected to database');
        });
        // User.create({
            // username: 'admin',
            // password: '123456',
            // role: 2,
            // email: 'admin@gmail.com',
            // name: 'abcvjp',
            // phone: '123456789'
        // });
        // Post.create({
            // title: 'Day la mot bai viet thu vi nua',
            // category: '6001097f1af49024545911b5',
            // isApproved: true,
            // tags: ['bai viet', 'thu vi'],
            // author: '60010bd8a2578116902e3dde',
            // content: 'noi dung bai viet nay cung thu vi ko kem'});
            const users = await User.find({$text: {$search: 'abcvjp'}}).select('_id').exec();
            if (!users || !users.length) {
                console.log('not found');
                return;
            }
            const result = await Post.find().where({author: {$in: users}}).exec();
            console.log(result);
    } catch(err) {
        console.log(err);
    }
}
doit();