
const { urlencoded } = require('express');
const { updateOne } = require('../models/user');
const userModel = require('../models/user');
const ErrorRespond = require('../utils/ErrorResponse');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

module.exports.getUsers = async (req, res, next) => {
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
        query = userModel.find(queryObject);
        
        // get selected fields
        
        let select = req.query.select || '';
        if (req.user.role !== 2) select = select.concat('-password'); // exclude password field
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

        const total = await userModel.countDocuments();
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

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await userModel.findOne({_id: req.params.userId}).select('-password');
    if (!user) {
      const err = new ErrorRespond('User does not exists', 404);
      return next(err);
    }
    sendSuccessResponse(res, user);
  } catch(err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
      const userObject = req.body;
      if (userObject) {
        var err = new ErrorRespond('Bad Request', 400);
        return next(err);
      }
      const newPost = new postModel(userObject);
      await newPost.save();
      sendSuccessResponse(res);
  } catch(err) {
      next(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    await postModel.deleteOne({_id: req.params.userId});
    sendSuccessResponse(res);
  } catch(err) {
      next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const updateObject = req.body;
    if (!updateObject) {
        let err = new ErrorRespond('Bad Request', 400);
        return next(err);
    }
    if (updateObject._id || updateObject.username) {
      let err = new ErrorRespond('The given field could not be updated', 400);
      return next(err);
    }
    await userModel.findOne({_id: req.params.userId}, async (err, user) => {
      if (err) {
        return next(err);
      }
      Object.entries(updateObject).forEach((prop) => {
        const [key, value] = prop;
        user[key] = value;
        console.log({key, value});
      });
      await user.save();
      sendSuccessResponse(res);
    });
  } catch(err) {
    next(err);
  }
};

