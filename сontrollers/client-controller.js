let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');
let SqlHelper = require('../helpers/sql-helper');

let controller = {};

controller.getById = async function (req, res, next) {
    let query = req.query;
    console.log(query);
    let table = 'clients';
    let attributes = query.attributes.length > 0 ? query.attributes : undefined;
    let includes = query.include.length > 0 ? db.client.buildJoins(query.include) : undefined;

    //todo
    console.log(includes);
    let sql = SqlHelper.buildSql(table,attributes);

    console.log(sql);
    // res.json(await db.client.findById(req.params.id))
};
controller.getAll = async function (req, res, next) {
    res.json(await db.client.findAll())
};
controller.create = async function (req, res, next) {
    try {
        let model = await db.client.create(req.body);
        res.status(201).json(model);
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
        await db.client.destroy({where: {id: req.params.id}, limit: 1});
        res.sendStatus(204);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Client controller'))
    }
};

module.exports = controller;