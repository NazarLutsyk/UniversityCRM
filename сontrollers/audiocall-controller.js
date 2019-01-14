let path = require('path');
let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

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
                limit: query.limit
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
        let models = await db.audio_call.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.audio_call.create(req.body);
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
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
        await db.audio_call.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'AudioCall controller'))
    }
};

controller.upload = async function(req, res, next){
    let audio_callId = req.params.id;
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
                                path: path.join('audiocalls',req.files[file].filename),
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
                return next(new ControllerError(err.message, 400, 'AudioCall controller'));
            }
        }
    });

};

module.exports = controller;