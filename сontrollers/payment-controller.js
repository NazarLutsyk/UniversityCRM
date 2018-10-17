let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.payment.findById(
            req.params.id,
            {
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.payment.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.payment.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.payment.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Payment controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.payment.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};

module.exports = controller;