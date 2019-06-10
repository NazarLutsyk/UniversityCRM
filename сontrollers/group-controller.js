let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.group.findById(
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
        next(new ControllerError(e.message, 400, 'Group controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }

        if (query.q.expirationDate) {
            query.q.expirationDate = {
                $gte: query.q.expirationDate
            };
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'course.name')  && includeTableName === 'course') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.course.name}%`
                        }
                    };
                    required = true;
                }
                if (_.has(query.q, 'course.id')  && includeTableName === 'course') {
                    includeWhere = {
                        id: query.q.course.id
                    };
                    required = true;
                }
                if (_.has(query.q, 'city.name')  && includeTableName === 'city') {
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
        let models = await db.group.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.group.count(
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
        next(new ControllerError(e.message, 400, 'Group controller'));
    }
};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.group.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.group.requiredFileds, 400, 'Group controller'));
        }
        let model = await db.group.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Group controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.group.notUpdatableFields);
        let id = req.params.id;
        let model = await db.group.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Group controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Group controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.group.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Group controller'))
    }
};


module.exports = controller;
