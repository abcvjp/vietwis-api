const loginRouter = require('express').Router();
const loginController = require('../controllers/login');
const authenticate = require('../middlewares/authenticate');

loginRouter.post('', authenticate(), loginController.login);

module.exports = loginRouter;