const router = require('express').Router();
const postRouter = require('./post');
const userRouter = require('./user');
const categoryRouter = require('./category');
const loginRouter = require('./login');
const signupRouter = require('./signup');
const errorHandler = require('../middlewares/errorHandler');
const logoutRouter = require('./logout');
const searchRouter = require('./search.js');

router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/category', categoryRouter);
router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/logout', logoutRouter);
router.use('/search', searchRouter);
router.use(errorHandler);
module.exports = router;