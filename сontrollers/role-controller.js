let ControllerError = require('../errors/ControllerError');
let ROLES = require('../config/roles');

let controller = {};

controller.getAll = async function (req, res, next) {
    try {
        res.json(ROLES);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Role controller'));
    }
};

module.exports = controller;