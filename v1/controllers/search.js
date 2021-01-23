const ErrorRespond = require("../../../blog/api/utils/ErrorResponse");
const User = require('../models/user');
const Post = require('../models/post');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

module.exports = async (req, res, next) => {
    try {
        // build search query
        let query = null;
        if (!req.query.type) {
            next(new ErrorRespond('search type is required', 400));
            return;
        }
        else if (req.query.type === 'title' || req.query.type === 'tag') {
            query = Post.find({$text: {$search: req.query.q}})
            .select('-content')
            .populate('author', 'name');
        }
        else if (req.query.type === 'author') {
            const users = await User.find({$text: {$search: req.query.q}}).select('_id').exec();
            if (!users || !users.length) {
                next(new ErrorRespond('result not found', 404));
                return;
            }
            query = Post.find().where({author: {$in: users}}).populate('author', 'name');
        }
        else {
            next(new ErrorRespond('Search type is not supported', 400));
            return;
        }
        
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

        const total = await Post.countDocuments();
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

        if (!data || !data.length) {
            const err = new ErrorRespond('Result not found', 404);
            return next(err);
        };

        // send success response
        sendSuccessResponse(res, data, [{count: data.length}, {pagination: {prev: prevPag, next: nextPag}}]);
    } catch(err) {
        next(err);
    }
}