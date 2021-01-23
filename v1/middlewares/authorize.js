const ErrorRespond = require("../utils/ErrorResponse");

module.exports = (...roles) => async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        const err = new ErrorRespond('You do not have permission to this one', 403);
        return next(err);
    };
    next();
}