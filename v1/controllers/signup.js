
const userModel = require('../models/user');
const ErrorRespond = require('../utils/ErrorResponse');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

module.exports.signup = async (req, res, next) => {
    try {
        const userObject = req.body;
        if (!userObject) {
            const err = new ErrorRespond('Bad Request', 400);
        }
        const user = new userModel(userObject);
        await user.save();
        sendSuccessResponse(res);
    } catch(err) {
        return next(err);
    }
};
