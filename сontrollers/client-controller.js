let path = require('path');

let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let ObjectHelper = require('../helpers/object-helper');

const passportPath = path.join(__dirname, '../public', 'upload', 'passports');
let upload = require('../middleware/file-midlleware')(passportPath);

upload = upload.array('passports');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.client.findByPk(
            req.params.id,
            {
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );
        res.json(models);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'));
    }
};
controller.getAll = async function (req, res, next) {
    try {
        let freebies = [];
        let query = req.query;
        if (_.has(query.q, 'fullname.$like')) {
            query.q.$or = [
                            {
                                name: {
                                    $like: `%${query.q.fullname.$like}%`
                                }
                            },
                            {
                                surname: {
                                    $like: `%${query.q.fullname.$like}%`
                                }
                            }
                        ];
            delete query.q.fullname;
        }
        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }
        if (_.has(query.q, 'surname.$like')) {
            query.q.surname.$like = `%${query.q.surname.$like}%`
        }
        if (_.has(query.q, 'age.$like')) {
            query.q.age.$like = `%${query.q.age.$like}%`
        }
        if (_.has(query.q, 'phone.$like')) {
            query.q.phone.$like = `%${query.q.phone.$like}%`
        }
        if (_.has(query.q, 'email.$like')) {
            query.q.email.$like = `%${query.q.email.$like}%`
        }

        if (_.has(query.q, 'freebie')) {
            const rawResult = await db.sequelize.query(
                    `select clientId, SUM(fullPrice) as sum
                     from application
                     group by clientId
                     having sum <= 0`,
                {raw: true});
            freebies = rawResult[0].map(r => r.clientId);
            if (freebies) {
                query.q.id = {$in: freebies};
            }
            delete query.q.freebie;
        }

        let newIncludes = [];
        if (query.include.length > 0) {
            for (const includeTableName of query.include) {
                let include = null;
                let includeWhere = {};
                let innerInclude = null;
                let required = false;
                if (_.has(query.q, 'application.groupId') && includeTableName === 'application') {
                    includeWhere = {
                        groupId: query.q.application.groupId
                    };
                    required = true;
                }
                if (_.has(query.q, 'social.url') && includeTableName === 'social') {
                    includeWhere = {
                        url: {
                            $like: `%${query.q.social.url}%`
                        }
                    };
                    required = true;
                }
                if (includeTableName === 'application' && _.has(query.q, 'debtor')) {
                    innerInclude = {
                        model: db.payment,
                        where: {
                            expectedDate: {
                                $lte: new Date()
                            },
                            paymentDate: null
                        },
                        required: true
                    };
                    delete query.q.debtor;
                }
                include = {
                    model: db[includeTableName],
                    required,
                    where: includeWhere
                };
                if (innerInclude) {
                    include.include = [innerInclude];
                }
                newIncludes.push(include);
                if (query.q[includeTableName])
                    delete query.q[includeTableName];
            }
        }

        query.include = newIncludes;
        let models = await db.client.findAll(
            {
                where: query.q,
                attributes: query.attributes,
                order: query.sort,
                offset: query.offset,
                limit: query.limit,
                include: query.include,
            },
        );
        let count = await db.client.count(
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
        next(new ControllerError(e.message, 400, 'Client controller'));
    }

};
controller.create = async function (req, res, next) {
    try {
        if (!ObjectHelper.has(req.body, db.client.requiredFileds)) {
            return next(new ControllerError('Missed required fields! ' + db.client.requiredFileds, 400, 'Client controller'));
        }
        res.status(201).json(await db.client.supersave(req.body));
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        ObjectHelper.clean(req.body, db.client.notUpdatableFields);
        let id = req.params.id;
        let model = await db.client.findByPk(id);
        if (model) {
            if (_.has(req.body, 'address')) {
                let address = await model.getAddress();
                if (req.body.address && address) {
                    await address.updateAttributes(req.body.address)
                } else if (req.body.address && !address) {
                    await model.setAddress(db.address.build(req.body.address));
                } else if (address && !req.body.address) {
                    await address.destroy();
                }
            }
            res.status(201).json(await model.update(req.body));
        } else {
            next(new ControllerError('Model not found', 400, 'Client controller'))
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'))
    }
};

controller.remove = async function (req, res, next) {
    try {
        let toDelete = await db.client.findOne({where: {id: req.params.id}});
        await toDelete.destroy();
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'))
    }
};

controller.uploadPassport = async function (req, res, next) {
    let clientId = req.params.id;
    try {
        if (await db.client.findByPk(clientId)) {
            upload(req, res, async function (err) {
                if (err) {
                    return next(new ControllerError(err.message, 400, 'Client controller'));
                } else {
                    try {
                        let images = [];
                        if (req.files && req.files.length > 0) {
                            for (let file in req.files) {
                                try {
                                    let image = await db.file.create({
                                        path: path.join('passports', req.files[file].filename),
                                        clientId
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
                        return next(new ControllerError(e.message, 400, 'Client controller'));
                    }
                }
            });
        } else {
            return next(new ControllerError('Client not found', 400, 'Client controller'));
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Client controller'));
    }
};

controller.exists = async (req, res, next) => {
    try {
        let body = req.body;
        let where = {$or: []};
        if (body.name && body.surname) {
            where.$or.push(
                {
                    name: {
                        $like: `%${body.name}%`
                    },
                    surname: {
                        $like: `%${body.surname}%`
                    }
                }
            );
        }
        if (body.email) {
            where.$or.push(
                {
                    email: {
                        $like: `%${body.email}%`
                    }
                }
            );
        }
        if (body.phone) {
            where.$or.push({
                phone: {
                    $like: `%${body.phone}%`
                }
            });
        }

        if (where.$or.length > 0) {
            let founded = await db.client.findAll({
                where
            });
            res.json(founded);
        } else {
            res.json([]);
        }
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Client controller'));
    }
};

controller.getLessons = async (req, res, next) => {
    try {
        let client = await db.client.findByPk(
            req.params.id,
            {
                include: [
                    {
                        model: db.application,
                        include: [
                            {
                                model: db.lesson,
                                through: db.journal,
                                required: true
                            },
                            {
                                model: db.course
                            }
                        ]
                    },
                    {
                        model: db.comment
                    }
                ]
            }
        );
        return res.json(client);
    } catch (e) {
        return next(new ControllerError(e.message, 400, 'Client controller'));
    }
};

controller.getAddresses = async (req, res, next) => {
    try {
        res.json(await db.address.findAll());
    } catch (e) {
        console.log(e);
        return next(new ControllerError(e.message, 400, 'Client controller'));
    }
};

module.exports = controller;
