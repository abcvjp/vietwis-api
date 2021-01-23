const searchRouter = require('express').Router();
const searchController = require('../controllers/search');

module.exports = searchRouter.get('/', searchController);