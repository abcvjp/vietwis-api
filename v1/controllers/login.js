const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorRespond = require('../utils/ErrorResponse');
const sendSuccessResponse = require('../utils/sendSuccessResponse');

module.exports.login = async (req, res, next) => {
    try {
        if (req.user) {
            const err = new ErrorRespond('You are already logged in', 406);
            return next(err);
        }
        const clientUser = req.body;
        if (!clientUser || !clientUser.username || !clientUser.password) {
            const err = new ErrorRespond('Bad Resquest', 400);
            return next(err);
        }
        const user = await userModel.findOne({username: clientUser.username});
        console.log(user);
        if (!user) {
            const err = new ErrorRespond('User does not exist', 404);
            return next(err);
        } else if (await bcrypt.compare(clientUser.password, user.password)) {
            const token = user.getSignedToken();
            res.setHeader('WWW-Authenticate', 'Bearer ' + token);
            res.cookie('token', token, {maxAge: 3600000});
            sendSuccessResponse(res, null, [{token: token}]);
        } else {
            const err = new ErrorRespond('Password is incorrect', 401)
            return next(err);
        }
    } catch(err) {
        next(err);
    }
};
