module.exports = class ErrorRespond extends Error {
    constructor(message, statusCode) {
        super(message);
        this.status = statusCode;
    }
}