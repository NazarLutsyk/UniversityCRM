let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.manager.findById(
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
        next(new ControllerError(e.message, 400, 'Manager controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }
        if (_.has(query.q, 'surname.$like')) {
            query.q.surname.$like = `%${query.q.surname.$like}%`
        }
        if (_.has(query.q, 'login.$like')) {
            query.q.login.$like = `%${query.q.login.$like}%`
        }
        if (_.has(query.q, 'role.$like')) {
            query.q.role.$like = `%${query.q.role.$like}%`
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'city.name') && includeTableName === 'city') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.city.name}%`
                        }
                    };
                    required = true;
                }
                include = {
                    model: db[includeTableName],
                    required,
                    where: includeWhere
                };
                newIncludes.push(include);
                delete query.q[includeTableName];
            }
        }
        query.include = newIncludes;

        let models = await db.manager.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );
        let count = await db.manager.count(
            {
                where: query.q,
                include: query.include,
            }
        );
        res.json({
            models,
            count
        });
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Manager controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.manager.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Manager controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.manager.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Manager controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Manager controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.manager.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Manager controller'))
    }
};


module.exports = controller;