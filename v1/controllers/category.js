
const categoryModel = require('../models/category');
const ErrorRespond = require('../utils/ErrorResponse');
const getItemsController = require('../utils/getItemsController');
const sendSuccessResponse = require('../utils/sendSuccessResponse');


module.exports.getCategories = getItemsController(categoryModel);

module.exports.getCategory = async (req, res, next) => {
    try {
        const data = await categoryModel.findOne({_id: req.params.categoryId});
        if (!data) {
            const err = new ErrorRespond('Category does not exist', 404);
            return next(err);
        }
        sendSuccessResponse(res, data);
    } catch(err) {
        next(err);
    }
};

module.exports.createCategory = async (req, res, next) => {
    try {
        const categoryObject = req.body;
        if (!categoryObject) {
            const err = new ErrorRespond('Bad Request', 400);
            return next(err);
        }
        const newCategory = new categoryModel(categoryObject);
        await newCategory.save();
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};

module.exports.deleteCategory = async (req, res, next) => {
    try {
        await categoryModel.deleteOne({_id: res.locals.category._id});
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};

module.exports.updateCategory = async (req, res, next) => {
    try {
        const updateObject = req.body;
        await categoryModel.updateOne({_id: res.locals.category._id}, updateObject);
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};
