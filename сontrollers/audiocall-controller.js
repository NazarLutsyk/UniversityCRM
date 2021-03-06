let _ = require('lodash');

let path = require('path');
let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

const audioCallsPath = path.join(__dirname, '../public', 'upload', 'audiocalls');
let upload = require('../middleware/file-midlleware')(audioCallsPath);

upload = upload.array('files');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.audio_call.findById(
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
        next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'comment.$like')) {
            query.q.comment.$like = `%${query.q.comment['$like']}%`
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'clientFullname') && includeTableName === 'client') {
                    includeWhere = {
                        $or: [
                            {
                                name: {
                                    $like: `%${query.q.clientFullname}%`
                                }
                            },
                            {
                                surname: {
                                    $like: `%${query.q.clientFullname}%`
                                }
                            }
                        ]
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

        let models = await db.audio_call.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.audio_call.count(
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
        next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.audio_call.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.audio_call.requiredFileds, 400, 'AudioCall controller'));
        }
        let model = await db.audio_call.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.audio_call.notUpdatableFields);
        let id = req.params.id;
        let model = await db.audio_call.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'AudioCall controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        let toDelete = await db.audio_call.findOne({where: {id: req.params.id}});
        await toDelete.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'))
    }
};

controller.upload = async function (req, res, next) {
    let audio_callId = req.params.id;
    try {
        if (await db.audio_call.findByPk(audio_callId)) {
            upload(req, res, async function (err) {
                if (err) {
                    return next(new ControllerError(err.message, 400, 'AudioCall controller'));
                } else {
                    try {
                        let images = [];
                        if (req.files && req.files.length > 0) {
                            for (let file in req.files) {
                                try {
                                    let image = await db.file.create({
                                        path: path.join('audiocalls', req.files[file].filename),
                                        audio_callId
                                    });
                                    images.push(image);
                                } catch (e) {
                                    e.status = 400;
                                    return next(e);
                                }
                            }
                        }
                        return res.json(images);
                    } catch (e) {
                        return next(new ControllerError(e.message, 400, 'AudioCall controller'));
                    }
                }
            });
        } else {
            return next(new ControllerError('AudioCall not found', 400, 'AudioCall controller'));
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }
};

module.exports = controller;
