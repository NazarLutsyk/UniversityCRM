let path = require('path');

let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

const passportPath = path.join(__dirname, '../public', 'upload', 'passports');
let upload = require('../middleware/file-midlleware')(passportPath);

upload = upload.array('passports');

let controller = {};

controller.getById = async function (req, res, next) {
    try {
        let query = req.query;
        let models = await db.client.findById(
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

        if (_.has(query.q, 'name.$like')) {
            query.q.name.$like = `%${query.q.name.$like}%`
        }
        if (_.has(query.q, 'surname.$like')) {
            query.q.surname.$like = `%${query.q.surname.$like}%`
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
                let required = false;
                if (_.has(query.q, 'application.groupId') && includeTableName === 'application') {
                    includeWhere = {
                        groupId: query.q.application.groupId
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
        res.status(201).json(await db.client.supersave(req.body));
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'));
    }
};
controller.update = async function (req, res, next) {
    try {
        let id = req.params.id;
        let model = await db.client.findById(id);
        if (model) {
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
                console.log(e);
                return next(new ControllerError(err.message, 400, 'Client controller'));
            }
        }
    });
};

module.exports = controller;