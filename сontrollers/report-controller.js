let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let path = require('path');
const paymentsPath = path.join(__dirname, '../public', 'upload', 'payments');
let upload = require('../middleware/file-midlleware')(paymentsPath);

upload = upload.array('files');

let controller = {};

controller.getAll = async function (req, res, next) {
    try {
        const startDate = req.query.q && req.query.q.fromDate ? req.query.q.fromDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.toDate ? req.query.q.toDate : '3000-12-12';
        if(req.query.q !== null) {
            if(req.query.q.groupsIds.length < 1) {
                let allModels = await db.sequelize.query(
                    `select s.name as status, SUM(p.amount) as amount, s.color as color
                    from payment p
                    join application a on p.applicationId = a.id
                    join client cl on a.clientId = cl.id
                    join \`group\` g on a.groupId = g.id
                    join status s on cl.statusId = s.id
                    where !ISNULL(p.paymentDate)
                    and p.paymentDate >= '1970.01.01'
                    and p.paymentDate <= '3000.12.12'
                    group by s.id`,
                    {replacements: {startDate, endDate}}
                );
                return res.json(allModels);
            }else {
                let sqlQueryExpected = `select s.name as status, SUM(p.expectedAmount) as expectedAmount, s.color as color
                    from payment p
                    join application a on p.applicationId = a.id
                    join client cl on a.clientId = cl.id
                    join \`group\` g on a.groupId = g.id
                    join status s on cl.statusId = s.id
                    where !ISNULL(p.expectedDate)
                    and p.expectedDate >= :startDate
                    and p.expectedDate <= :endDate
                    and g.id in (`;
                req.query.q.groupsIds.forEach(id => {
                    sqlQueryExpected += `${id}, `
                });
                sqlQueryExpected = sqlQueryExpected.slice(0, -2) + `)\n group by s.id
                `;

                let modelsExpected = await db.sequelize.query(
                    sqlQueryExpected,
                    {replacements: {startDate, endDate}}
                );


                let sqlQuery = `select s.name as status, SUM(p.amount) as amount, s.color as color
                    from payment p
                    join application a on p.applicationId = a.id
                    join client cl on a.clientId = cl.id
                    join \`group\` g on a.groupId = g.id
                    join status s on cl.statusId = s.id
                    where !ISNULL(p.paymentDate)
                    and p.paymentDate >= :startDate
                    and p.paymentDate <= :endDate
                    and g.id in (`;
                req.query.q.groupsIds.forEach(id => {
                    sqlQuery += `${id}, `
                });
                sqlQuery = sqlQuery.slice(0, -2) + `)\n group by s.id`;

                let models = await db.sequelize.query(
                    sqlQuery,
                    {replacements: {startDate, endDate}}
                );

                let r = [models[0], modelsExpected[0]];
                return res.json(r);
            }
        }
    } catch (e) {
        console.log(e);
        next(new ControllerError(e.message, 400, 'Report controller'));
    }

};

module.exports = controller;
