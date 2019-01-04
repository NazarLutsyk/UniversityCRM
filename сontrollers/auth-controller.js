let passport = require('passport');
let db = require('../db/models');

let controller = {};

controller.login = async function (req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {
        if (err) {
            return next(e);
        }
        if (!user) {
            return res.sendStatus(400);
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
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
        return next(e);
    }
};

controller.logout = async function (req, res, next) {
    req.logout();
    res.json();
};

module.exports = controller;