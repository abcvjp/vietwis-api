const userRouter = require('express').Router();
const { getUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/user');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

userRouter.route('').get(authenticate({protect: true}), authorize(2), getUsers).post(createUser);
userRouter.route('/:userId').get(getUser).put(authenticate({protect: true}), authorize(1,2), updateUser)
.delete(authenticate({protect: true}), authorize(2), deleteUser);

module.exports = userRouter;