const sendSuccessResponse = require('./sendSuccessResponse');
const ErrorRespond = require('./ErrorResponse');

module.exports = (model) => async (req, res, next) => {
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
        query = model.find(queryObject);
        
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

        const total = await model.countDocuments();
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