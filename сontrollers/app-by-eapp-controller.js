let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.create = async function (req, res, next) {
    try {
            if (!req.body.clientId) {
                let client = await db.client.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    age: req.body.age,
                    phone: req.body.phone,
                    email: req.body.email,
                    statusId: req.body.statusId
                });
                await db.comment.create({
                    clientId: client.id,
                    text: req.body.comment
                });
                await db.application.create({
                    date: req.body.date,
                    fullPrice: req.body.fullPrice,
                    discount: req.body.discount,
                    wantPractice: req.body.wantPractice,
                    source: req.body.source,
                    courseId: req.body.courseId,
                    cityId: req.body.cityId,
                    clientId: client.id,
                    groupId: req.body.groupId
                });

            } else if (req.body.clientId) {
                await db.application.create({
                    date: req.body.date,
                    fullPrice: req.body.fullPrice,
                    discount: req.body.discount,
                    wantPractice: req.body.wantPractice,
                    source: req.body.source,
                    courseId: req.body.courseId,
                    cityId: req.body.cityId,
                    clientId: req.body.clientId,
                    groupId: req.body.groupId
                });
                await db.comment.create({
                    clientId: req.body.clientId,
                    text: req.body.comment
                });
            }
        res.status(201).json({status:201});
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Task controller'));
    }
};
module.exports = controller;
