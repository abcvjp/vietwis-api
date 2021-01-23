const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/post');
const postRouter = require('express').Router();
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

postRouter.route('').get(getPosts).post(authenticate({protect: true}), authorize(1,2), createPost);
postRouter.route('/:postId').get(getPost).put(authenticate({protect: true}), authorize(1,2), updatePost)
.delete(authenticate({protect: true}), authorize(2), deletePost);

module.exports = postRouter;