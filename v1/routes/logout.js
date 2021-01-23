const logoutRouter = require('express').Router();
const logoutController = require('../controllers/logout');

logoutRouter.get('', logoutController);

module.exports = logoutRouter;