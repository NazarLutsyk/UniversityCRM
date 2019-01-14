let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let path = require('path');
const paymentsPath = path.join(__dirname, '../public', 'upload', 'payments');
let upload = require('../middleware/file-midlleware')(paymentsPath);

upload = upload.array('files');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.payment.findById(
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
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let query = req.query;

        if (_.has(query.q, 'number.$like')) {
            query.q.number.$like = `%${query.q.number.$like}%`
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let required = false;
                if (_.has(query.q, 'application.id') && includeTableName === 'application') {
                    includeWhere = {
                        id: query.q.application.id
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

        let models = await db.payment.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include
            },
        );
        let count = await db.payment.count(
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
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        let model = await db.payment.create(req.body);
        let application = await model.getApplication();
        application.leftToPay -= model.amount;
        await application.save();
        res.status(201).json(model);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};

controller.remove = async function (req, res, next) {
    try {
        let paymentToDestroy = await db.payment.findById(req.params.id);
        let application = await paymentToDestroy.getApplication();
        application.leftToPay += paymentToDestroy.amount;
        await application.save();
        await paymentToDestroy.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};

controller.upload = async function (req, res, next) {
    let paymentId = req.params.id;
    upload(req, res, async function (err) {
        if (err) {
            return next(new ControllerError(err.message, 400, 'Payment controller'));
        } else {
            try {
                let paymentFiles = [];
                if (req.files && req.files.length > 0) {
                    for (let file in req.files) {
                        try {
                            console.log('ok');
                            let paymentFile = await db.file.create({
                                path: path.join('payments', req.files[file].filename),
                                paymentId
                            });
                            paymentFiles.push(paymentFile);
                        } catch (e) {
                            e.status = 400;
                            return next(e);
                        }
                    }
                }
                return res.json(paymentFiles);
            } catch (e) {
                return next(new ControllerError(err.message, 400, 'Payment controller'));
            }
        }
    });
};

module.exports = controller;