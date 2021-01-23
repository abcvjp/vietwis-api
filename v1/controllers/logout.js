const sendSuccessResponse = require("../utils/sendSuccessResponse");

module.exports = async (req, res, next) => {
    try {
        res.clearCookie('token');
        sendSuccessResponse(res);
    } catch(err) {
        next(err);
    }
}