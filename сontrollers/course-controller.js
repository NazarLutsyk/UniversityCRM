let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.course.findById(
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
        next(new ControllerError(e.message, 400, 'Course controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }

        let models = await db.course.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit
            },
        );
        let count = await db.course.count(
            {
                where: query.q
            }
        );

        res.json({
            models,
            count
        });
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Course controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.course.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.course.requiredFileds, 400, 'Course controller'));
        }
        let courseBuild = req.body;
        courseBuild.discount = req.body.discount ? req.body.discount : 0;
        courseBuild.resultPrice = courseBuild.fullPrice - (courseBuild.fullPrice * (courseBuild.discount / 100));

        let model = await db.course.create(courseBuild);

        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Course controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.course.notUpdatableFields);

        let id = req.params.id;
        let courseBuild = req.body;
        courseBuild.discount = req.body.discount ? req.body.discount : 0;
        courseBuild.resultPrice = courseBuild.fullPrice - (courseBuild.fullPrice * (courseBuild.discount / 100));
        let model = await db.course.findById(id);
        if (model) {
            res.status(201).json(await model.update(courseBuild));
        } else {
            next(new ControllerError('Model not found', 400, 'Course controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Course controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.course.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Course controller'))
    }
};

module.exports = controller;
