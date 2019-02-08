let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let path = require('path');
const paymentsPath = path.join(__dirname, '../public', 'upload', 'payments');
let upload = require('../middleware/file-midlleware')(paymentsPath);
let ObjectHelper = require('../helpers/object-helper');

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
            for (let includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let innerInclude = null;
                let required = false;
                if (_.has(query.q, 'application.id') && includeTableName === 'application') {
                    includeWhere = {
                        id: query.q.application.id
                    };
                    required = true;
                }
                if (includeTableName === 'application>client') {
                    includeTableName = 'application';
                    innerInclude = db.client;
                }
                include = {
                    model: db[includeTableName],
                    required,
                    where: includeWhere,
                };
                if (innerInclude) {
                    include.include = [{model: innerInclude}];
                }
                newIncludes.push(include);
                if (query.q[includeTableName])
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
        if (!ObjectHelper.has(req.body, db.payment.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.payment.requiredFileds, 400, 'Payment controller'));
        }
        let model = await db.payment.create(req.body);
        let application = await model.getApplication();
        application.leftToPay -= model.amount ? model.amount : 0;
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

controller.update = async (req, res, next) => {
    let transaction;
    try {
        ObjectHelper.clean(req.body, db.payment.notUpdatableFields);
        let id = req.params.id;
        let model = await db.payment.findById(id);
        if (model) {
            if (req.body.amount && req.body.amount !== model.amount) {
                let application = await model.getApplication();
                const amountDifference = req.body.amount - (model.amount ? model.amount : 0);
                application.leftToPay = application.leftToPay - amountDifference;
                transaction = await db.sequelize.transaction();
                await application.save({transaction});
                await model.update(req.body, {transaction});
                await transaction.commit();
                res.status(201).json(await model.update(req.body));
            } else {
                res.status(201).json(await model.update(req.body));
            }
        } else {
            next(new ControllerError('Model not found', 400, 'Payment controller'))
        }
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
        }
        next(new ControllerError(e.message, 400, 'Payment controller'))
    }
};

controller.upload = async function (req, res, next) {
    let paymentId = req.params.id;
    try {
        if (await db.payment.findByPk(paymentId)) {
            upload(req, res, async function (err) {
                if (err) {
                    return next(new ControllerError(err.message, 400, 'Payment controller'));
                } else {
                    try {
                        let paymentFiles = [];
                        if (req.files && req.files.length > 0) {
                            for (let file in req.files) {
                                try {
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
                        return next(new ControllerError(e.message, 400, 'Payment controller'));
                    }
                }
            });
        } else {
            return next(new ControllerError('Payment not found', 400, 'Client controller'));
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Payment controller'));
    }
};

module.exports = controller;
