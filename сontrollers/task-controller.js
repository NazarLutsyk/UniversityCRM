let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.task.findById(
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
        next(new ControllerError(e.message, 400, 'Task controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'message.$like')) {
            query.q.message.$like = `%${query.q.message.$like}%`
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'client.name')  && includeTableName === 'client') {
                    includeWhere = {
                        $or: [
                            {
                                name: {
                                    $like: `%${query.q.client.name}%`
                                }
                            },
                            {
                                surname: {
                                    $like: `%${query.q.client.name}%`
                                }
                            },
                        ]
                    };
                    required = true;
                }
                if (_.has(query.q, 'client.id') && includeTableName === 'client') {
                    includeWhere = {
                        id: query.q.client.id
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
        req.query.include = newIncludes;

        let models = await db.task.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );
        let count = await db.task.count(
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
        next(new ControllerError(e.message, 400, 'Task controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.task.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.task.requiredFileds, 400, 'Task controller'));
        }
        let model = await db.task.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Task controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.task.notUpdatableFields);
        let id = req.params.id;
        let model = await db.task.findById(id);
        if (model) {
            console.log(req.body);
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Task controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Task controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.task.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Task controller'))
    }
};


module.exports = controller;
