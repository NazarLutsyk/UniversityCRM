let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.competitor_application.findById(
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
        next(new ControllerError(e.message, 400, 'Competitor application controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'client.fullname') && includeTableName === 'client') {
                    includeWhere = {
                        $or: [
                            {
                                name: {
                                    $like: `%${query.q.client.fullname}%`
                                }
                            },
                            {
                                surname: {
                                    $like: `%${query.q.client.fullname}%`
                                }
                            }
                        ]
                    };
                    required = true;
                }
                if (_.has(query.q, 'competitor.name') && includeTableName === 'competitor') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.competitor.name}%`
                        }
                    };
                    required = true;
                }
                if (_.has(query.q, 'competitor.id') && includeTableName === 'competitor') {
                    includeWhere = {
                        id: query.q.competitor.id
                    };
                    required = true;
                }
                if (_.has(query.q, 'course.name') && includeTableName === 'course') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.course.name}%`
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

        let models = await db.competitor_application.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.competitor_application.count(
            {
                where: query.q
            }
        );

        res.json({
            models,
            count
        });
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Competitor application controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.competitor_application.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.competitor_application.requiredFileds, 400, 'Competitor application controller'));
        }
        let model = await db.competitor_application.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Competitor application controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.competitor_application.notUpdatableFields);
        let id = req.params.id;
        let model = await db.competitor_application.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Competitor application controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Competitor application controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.competitor_application.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Competitor application controller'))
    }
};


module.exports = controller;
