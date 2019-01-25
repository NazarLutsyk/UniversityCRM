let passport = require('passport');
let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.login = async function (req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {
        if (err) {
            return next(new ControllerError(err.message, 400, 'Auth controller'));
        }
        if (!user) {
            return next(new ControllerError('User not found', 400, 'Auth controller'));
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(new ControllerError(err.message, 400, 'Auth controller'));
            }
            return res.status(200).json(req.user);
        });
    })(req, res, next);
};

controller.principal = async function (req, res, next) {
    try {
        if (req.user) {
            return res.json(req.user);
        } else {
            return res.json(null);
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Auth controller'));
    }
};

controller.logout = async function (req, res, next) {
    req.logout();
    res.json();
};

module.exports = controller;
