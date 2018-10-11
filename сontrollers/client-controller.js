let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.client.findById(
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
        next(new ControllerError(e.message, 400, 'Client controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (query.q.name && query.q.name.$like) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }
        if (query.q.surname && query.q.surname.$like) {
            query.q.surname.$like = `%${query.q.surname.$like}%`
        }
        if (query.q.phone && query.q.phone.$like) {
            query.q.phone.$like = `%${query.q.phone.$like}%`
        }
        if (query.q.email && query.q.email.$like) {
            query.q.email.$like = `%${query.q.email.$like}%`
        }

        let models = await db.client.findAll(
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
        next(new ControllerError(e.message, 400, 'Client controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.client.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.client.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Client controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.client.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'))
    }
};

module.exports = controller;