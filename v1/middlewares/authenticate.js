const jwt = require('jsonwebtoken');
const ErrorRespond = require('../utils/ErrorResponse');

module.exports = (protect = {protect: false}) => async (req, res, next) => {
    req.user = null;
    let clientToken;
    try {
        if (!req.headers.authorization) {
            if (!req.cookies.token) {
                if (protect.protect === true) {
                    const err = new ErrorRespond('You must login to access this one', 403);
                    next(err);
                }
                return next();
            } else {
                clientToken = req.cookies.token;
            }
        } else if (req.headers.authorization.startsWith('Bearer ')) {
            clientToken = req.headers.authorization.split(' ')[1];
        } else {
            const err = new ErrorRespond('Authentication medthod error', 400);
            return next(err);
        }
        
        await jwt.verify(clientToken, process.env.accessTokenSecret, (err, user) => {
            if (err) {
                console.log('authenticate error: cant verify token');
                return next(err);
            }
            console.log('authenticated successfully');
            req.user = user;
            return next();
        });
    } catch (err) {
        next(err);
    }
};