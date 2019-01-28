let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.comment.findById(
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
        next(new ControllerError(e.message, 400, 'Comment controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'text.$like')) {
            query.q.text.$like = `%${query.q.text.$like}%`
        }


        let models = await db.comment.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit
            },
        );
        let count = await db.comment.count(
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
        next(new ControllerError(e.message, 400, 'Comment controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.comment.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.comment.requiredFileds, 400, 'Comment controller'));
        }
        let model = await db.comment.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Comment controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.comment.notUpdatableFields);
        let id = req.params.id;
        let model = await db.comment.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Comment controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Comment controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.comment.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Comment controller'))
    }
};


module.exports = controller;
