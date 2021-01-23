const postModel = require('../models/post');
const commentModel = require('../models/comment');
const comment = require('../models/comment');
const ErrorRespond = require('../utils/ErrorResponse');
const sendSuccessResponse = require('../utils/sendSuccessResponse');
const getItemsController = require('../utils/getItemsController');

module.exports.getPosts = getItemsController(postModel);

module.exports.getPost = async (req, res, next) => {
    try {
        const post = await postModel.findById(req.params.postId);
        if (!post) {
            const err = new ErrorRespond('Post does not exists', 404);
            return next(err);
        }
        sendSuccessResponse(res, post);
    } catch(err) {
        next(err);
    }
};

module.exports.createPost = async (req, res, next) => {
    try {
        const postObject = req.body;
        if (postObject) {
            const err = new ErrorRespond('Bad Request', 400);
            return next(err);
        }
        const newPost = new postModel(postObject);
        await newPost.save();
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};

module.exports.deletePost = async (req, res, next) => {
    try {
        await postModel.deleteOne({_id: req.params.postId});
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};

module.exports.updatePost = async (req, res, next) => {
    try {
        const updateObject = req.body;
        if (!updateObject) {
            const err = new ErrorRespond('Bad Request', 400);
            return next(err);
        }
        if (updateObject._id || updateObject.authorId) {
            const err = new ErrorRespond('The given field could not be updated', 400);
            return next(err);
        }
        await postModel.updateOne({_id: req.params.postId}, update);
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};

module.exports.getComments = async (req, res, next) => {
    try {
        let query;

        // correct query string to filter query object
        const queryString = JSON.stringify(req.query).replace(/\b(gt|lt|gte|lte|in)\b/g, (x) => {return `$${x}`;});
        const queryObject = JSON.parse(queryString);

        // field to exclude
        const excludeFields = ['select', 'sort', 'page', 'limit'];
        
        excludeFields.forEach((field) => {
            delete queryObject[field];
        });
        
        // start build query
        query = postModel.find(queryObject, 'comments');
        
        // get selected fields
        let select = req.query.select || '';
        select = select.split(',').join(' ');
        query.select(select);

        // get sorted fields
        let sort;
        if (req.query.sort) {
            sort = req.query.sort;
            if (sort.includes(',')) sort = sort.split(',').join(' ');
        } else { sort = '-createAt'; }
        query.sort(sort);

        // pagination
        const page = (req.query.page)?parseInt(req.query.page):1;
        const limit = (req.query.limit)?parseInt(req.query.limit):10;
        if (page < 1 || limit < 1 || isNaN(page) || isNaN(limit)) {
            const err = new ErrorRespond('Page or limit is not valid', 400);
            return next(err);
        }
        const skip = (page-1)*limit;
        query.skip(skip).limit(limit);

        const total = await postModel.findOne({_id: req.params.postId}, 'comments').length;
        let prevPag = {};
        let nextPag = {};
        if ((skip+limit) < total) {
            nextPag.page = page+1;
            nextPag.limit = (total - (skip+limit)) >= limit ? limit: (total - (skip+limit));
        } else {
          nextPag = null;
        }
        if (page > 1 && limit < total) {
            prevPag.page = page-1;
            prevPag.limit = limit;
        } else {
          prevPag = null;
        }

        // do query
        const data = await query.exec();

        if (!data || data.length === 0) {
            const err = new ErrorRespond('Result not found', 404);
            return next(err);
        };

        // send success response
        sendSuccessResponse(res, data, [{count: data.length}, {pagination: {prev: prevPag, next: nextPag}}]);
        
    } catch(err) {
        next(err);
    }
};

module.exports.createComment = async (req, res, next) => {
    try {
        const commentObject = req.body;
        if (!commentObject) {
            const err = new ErrorRespond('Bad Request', 400);
            return next(err);
        }
        await postModel.update({_id: req.params.postId},{$push: {comments: commentObject}});
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
};
