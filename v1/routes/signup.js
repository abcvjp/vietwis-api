
const signupRouter = require('express').Router();
const signupController = require('../controllers/signup');

signupRouter.post('', signupController.signup);

module.exports = signupRouter;