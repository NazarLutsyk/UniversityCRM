let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.status.findById(
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
        next(new ControllerError(e.message, 400, 'Client status controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }

        let models = await db.status.findAll(
            // {
            //     where: query.q,
            //     attributes: query.attributes,
            //     order: query.sort,
            //     offset: query.offset,
            //     limit: query.limit,
            //     include: query.include
            // },
        );
        // let count = await db.city.count(
        //     {
        //         where: query.q
        //     }
        // );
        res.json({
            models,
            // count
        });
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Status controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.status.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.status.requiredFileds, 400, 'Status controller'));
        }
        let model = await db.status.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Status controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.status.notUpdatableFields);
        let id = req.params.id;
        let model = await db.status.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'City controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client Status controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.status.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'City controller'))
    }
};


module.exports = controller;
