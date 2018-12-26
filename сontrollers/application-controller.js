let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.application.findById(
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
        next(new ControllerError(e.message, 400, 'Application controller'));
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
                if (_.has(query.q, 'client.name') && includeTableName === 'client') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.client.name}%`
                        }
                    };
                    required = true;
                }
                if (_.has(query.q, 'client.id') && includeTableName === 'client') {
                    includeWhere = {
                        id: query.q.client.id
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
                if (_.has(query.q, 'group.name') && includeTableName === 'group') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.group.name}%`
                        }
                    };
                    required = true;
                }
                if (_.has(query.q, 'group.id') && includeTableName === 'group') {
                    includeWhere = {
                        id: query.q.group.id
                    };
                    required = true;
                }
                if (_.has(query.q, 'source.name') && includeTableName === 'source') {
                    includeWhere = {
                        name: {
                            $like: `%${query.q.source.name}%`
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

        let models = await db.application.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );
        let count = await db.application.count(
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
        next(new ControllerError(e.message, 400, 'Application controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let sources = [];
        if (_.has(req.body, 'sources')) {
            sources = req.body.sources;
            delete req.body.sources;
        }
        let applicationBuild = req.body;
        let course = await db.course.findById(req.body.courseId);

        applicationBuild.discount = req.body.discount ? req.body.discount : course.discount;
        applicationBuild.fullPrice = course.fullPrice;
        applicationBuild.resultPrice = applicationBuild.fullPrice - (applicationBuild.fullPrice * (applicationBuild.discount / 100));
        applicationBuild.leftToPay = applicationBuild.resultPrice;

        let model = await db.application.create(applicationBuild);

        if (sources && sources.length > 0) {
            await model.setSources(sources);
        }

        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Application controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.application.findById(id);
        if (model) {
            if (_.has(req.body, 'sources')) {
                await model.setSources(req.body.sources);
                delete req.body.sources;
            }
            let updatedApp = await model.update(req.body);
            if (req.body.hasPractice === 1 || req.body.hasPractice === 0) {
                let group = await db.group.findById(updatedApp.groupId);
                if (group) {
                    let freePractice = group.freePractice;
                    let usedPractice = group.usedPractice;
                    if (req.body.hasPractice) {
                        --freePractice;
                        ++usedPractice;
                    } else {
                        ++freePractice;
                        --usedPractice;
                    }
                    await group.update({freePractice, usedPractice});
                }
            }
            res.status(201).json(updatedApp);
        } else {
            next(new ControllerError('Model not found', 400, 'Application controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Application controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        await db.application.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Application controller'))
    }
};


module.exports = controller;