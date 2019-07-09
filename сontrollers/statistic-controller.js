let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};

controller.cityManager = async function (req, res, next) {
    try {
        let stat = await db.sequelize.query(
                `
              select c.name as city, COUNT(c.id) as count
              from manager
                     join city_manager cm on manager.id = cm.managerId
                     join city c on cm.cityId = c.id
              group by cityId;
            `
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.cityApplication = async function (req, res, next) {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `
              select c.name as city, COUNT(a.id) as count
              from application a
                     join city c
                          on a.cityId = c.id
              where a.createdAt >= :startDate
                and a.createdAt <= :endDate
              group by cityId;
            `,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.sourceApplication = async function (req, res, next) {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `
              select s.name as source, COUNT(a.id) as count
              from application a
                     join source_application sa on a.id = sa.applicationId
                     join source s on sa.sourceId = s.id
              where a.createdAt >= :startDate
                and a.createdAt <= :endDate
              group by sourceId
            `,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.courseApplication = async function (req, res, next) {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `
              select c.name as course, COUNT(a.id) as count
              from application a
                     join course c on a.courseId = c.id
              where a.createdAt >= :startDate
                and a.createdAt <= :endDate
              group by courseId
            `,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.groupJournal = async function (req, res, next) {
    try {
        const groupId = req.query.q && req.query.q.groupId ? req.query.q.groupId : '';
        if (groupId) {
            let stat = await db.sequelize.query(
                    `
                  select CONCAT(c.name, ' ', c.surname) as client, COUNT(j.applicationId) as count
                  from \`group\`
                         join lesson l on \`group\`.id = l.groupId
                         join journal j on l.id = j.lessonId
                         join application a on j.applicationId = a.id
                         join client c on a.clientId = c.id
                  where \`group\`.id = :groupId
                  group by j.applicationId;
                `,
                {replacements: {groupId}}
            );
            res.json(stat[0]);
        } else {
            throw new Error('groupId is required');
        }
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.competitorApplications = async function (req, res, next) {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `
              select c.name as competitor, count(clientId) as count
              from competitor_application
                     join competitor c on competitor_application.competitorId = c.id
              where clientId in (select a.clientId
                                 from application a
                                 where a.createdAt >= :startDate
                                   and a.createdAt <= :endDate)
              group by c.name            `,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.paymentStat = async (req, res, next) => {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `select c.id as courseId,SUM(p.amount) as sum, c.name as courseName, 'paid'
                 from payment p
                        join application a on p.applicationId = a.id
                        join course c on a.courseId = c.id
                 where !ISNULL(p.paymentDate)
                   and p.paymentDate >= :startDate
                   and p.paymentDate <= :endDate
                 group by c.id
                 union
                 select c.id as courseId, SUM(p.expectedAmount) as sum, c.name as courseName, 'expected'
                 from payment p
                        join application a on p.applicationId = a.id
                        join course c on a.courseId = c.id
                 where ISNULL(p.paymentDate)
                   and p.expectedDate >= :startDate
                   and p.expectedDate <= :endDate
                 group by c.id;`,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};
controller.clientStatus = async (req, res, next) => {
    try {
        const startDate = req.query.q && req.query.q.startDate ? req.query.q.startDate : '1970-01-01';
        const endDate = req.query.q && req.query.q.endDate ? req.query.q.endDate : '3000-12-12';
        let stat = await db.sequelize.query(
                `
              select s.name as status, COUNT(s.id) as count, s.color as color
                from client c
                  join status s
                  on c.statusId = s.id
                    where c.createdAt >= :startDate
                    and c.createdAt <= :endDate
              group by statusId;
            `,
            {replacements: {startDate, endDate}}
        );
        res.json(stat[0]);
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};

controller.byFreeCourseGroupStatistic = async (req, res, next) => {
    try {
        let groupId = req.params.id;
        let [applicationsByGroup] = await db.sequelize.query(
                `
               select *
                  from application a
                       where a.groupId = ${groupId}
               group by a.id;
            `
        );

        const result = [];
        for (let i = 0; i < applicationsByGroup.length; i++) {
            let [applicationsFromAnotherGroups] = await db.sequelize.query(
                `
               select *
                  from application a
                       where a.id not like ${applicationsByGroup[i].id}
                       and a.clientId = ${applicationsByGroup[i].clientId}
               group by a.id;
            `
            );
            if(applicationsFromAnotherGroups[0]) {
                result.push(...applicationsFromAnotherGroups);
            }
        }
        res.json({applicationsByGroup, result});
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Statistic controller'));
    }
};



module.exports = controller;


