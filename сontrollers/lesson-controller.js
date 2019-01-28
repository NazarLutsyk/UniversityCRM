let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let _ = require('lodash');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                include = {
                    model: db[includeTableName],
                };
                newIncludes.push(include);
            }
        }
        query.include = newIncludes;

        let models = await db.lesson.findById(
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
        next(new ControllerError(e.message, 400, 'Lesson controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.lesson.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );

        let count = await db.lesson.count(
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
        next(new ControllerError(e.message, 400, 'Lesson controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.lesson.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.lesson.requiredFileds, 400, 'Lesson controller'));
        }
        let model = await db.lesson.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Lesson controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.lesson.notUpdatableFields);
        let id = req.params.id;
        let model = await db.lesson.findById(id);
        if (model) {
            if (_.has(req.body, 'applications')) {
                model.setApplications(req.body.applications);
                delete req.body.applications;
            }
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Lesson controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Lesson controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.lesson.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Lesson controller'))
    }
};


module.exports = controller;
