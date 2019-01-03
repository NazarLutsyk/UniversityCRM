let ControllerError = require('../errors/ControllerError');

let authMiddleware = {};

authMiddleware.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return next(new ControllerError('Please sign in', 403, 'Log in middleware'));
};

authMiddleware.isNotLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    return next(new ControllerError('Please logout', 403, 'Not log in middleware'));
};

module.exports = authMiddleware;