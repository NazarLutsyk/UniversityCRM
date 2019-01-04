let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.eapplication.findById(
            req.params.id,
            {
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Eapplication controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        let models = await db.eapplication.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.eapplication.count(
            {
                where: query.q
            }
        );

        res.json({
            models,
            count
        });
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Eapplication controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.eapplication.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Eapplication controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.eapplication.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Eapplication controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Eapplication controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.eapplication.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Eapplication controller'))
    }
};


module.exports = controller;