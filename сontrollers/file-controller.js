let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.remove = async function (req, res, next) {
    try {
        let toDelete = await db.file.findOne({where: {id: req.params.id}});
        await toDelete.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'File controller'))
    }};

module.exports = controller;
