let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let path = require('path');
const contractsPath = path.join(__dirname, '../public', 'upload', 'contracts');
let upload = require('../middleware/file-midlleware')(contractsPath);

upload = upload.array('files');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.contract.findById(
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
        next(new ControllerError(e.message, 400, 'Contract controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.contract.findAll(
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
        next(new ControllerError(e.message, 400, 'Contract controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let applicationId = req.params.applicationId;
        upload(req, res, async function (err) {
            if (err) {
                return next(new ControllerError(err.message, 400, 'Contract controller'));
            } else {
                try {
                    let contractFiles = [];
                    if (req.files && req.files.length > 0) {
                        let contract = await db.contract.create({
                            date: new Date(),
                            applicationId
                        });
                        for (let file in req.files) {
                            try {
                                let contractFile = await db.file.create({
                                    path: path.join('contracts', req.files[file].filename),
                                    contractId: contract.id
                                });
                                contractFiles.push(contractFile);
                            } catch (e) {
                                e.status = 400;
                                return next(e);
                            }
                        }
                    }
                    return res.json(contractFiles);
                } catch (e) {
                    return next(new ControllerError(err.message, 400, 'Contract controller'));
                }
            }
        });

    } catch (e) {
        next(new ControllerError(e.message, 400, 'Contract controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.contract.findById(id);
        if (model) {
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Contract controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Contract controller'))
    }
};
controller.remove = async function (req, res, next) {
    try {
        let toDelete = await db.contract.findOne({where: {id: req.params.id}});
        await toDelete.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Contract controller'))
    }
};

controller.upload = async function (req, res, next) {
    let contractId = req.params.id;
    upload(req, res, async function (err) {
        if (err) {
            return next(new ControllerError(err.message, 400, 'Contract controller'));
        } else {
            try {
                let contractFiles = [];
                if (req.files && req.files.length > 0) {
                    for (let file in req.files) {
                        try {
                            let contractFile = await db.file.create({
                                path: path.join('contracts', req.files[file].filename),
                                contractId
                            });
                            contractFiles.push(contractFile);
                        } catch (e) {
                            e.status = 400;
                            return next(e);
                        }
                    }
                }
                return res.json(contractFiles);
            } catch (e) {
                return next(new ControllerError(err.message, 400, 'Contract controller'));
            }
        }
    });
};

module.exports = controller;