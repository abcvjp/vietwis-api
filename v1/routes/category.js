const { getCategories, createCategory, updateCategory, deleteCategory, getCategory } = require('../controllers/category');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const categoryRouter = require('express').Router();

categoryRouter.route('').get(getCategories).post(authenticate({protect: true}), authorize(2), createCategory);
categoryRouter.route('/:categoryId').get(getCategory).put(authenticate({protect: true}), authorize(2), updateCategory)
.delete(authenticate({protect: true}), authorize(2), deleteCategory);

module.exports = categoryRouter;