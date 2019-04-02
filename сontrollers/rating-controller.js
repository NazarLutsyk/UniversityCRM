let _ = require('lodash');

let db = require('../db/models');
let ControllerError = require('../errors/ControllerError');

let controller = {};


controller.getByCourseId = async function (req, res, next) {
    try {
        let offset = req.query.offset ? req.query.offset : 0;
        let limit = req.query.limit ? req.query.limit : 9;
        let query = req.query.q.fullname ? `%${req.query.q.fullname}%` : '%%';
        let stat = await db.sequelize.query(
                `
              select CONCAT(c.name, ' ', c.surname)                             as fullname,
                     course.name                                                as course,
                     COUNT(c.id)                                                as visited,
                     (select count(id) from lesson where lesson.groupId = g.id) as full,
                     c.id as clientId
              from course
                     join \`group\` g on course.id = g.courseId
                     join application a on g.id = a.groupId
                     join journal j on a.id = j.applicationId
                     join client c on a.clientId = c.id
              where course.id = :courseId and c.name like :myQuery
                 or course.id = :courseId and c.surname like :myQuery
              group by applicationId
              order by visited DESC
              limit :myOffset, :myLimit
            `,
            {
                replacements: {
                    courseId: req.params.courseId,
                    myOffset: offset,
                    myLimit: limit,
                    myQuery: query
                }
            }
        );


        let count = await db.sequelize.query(
                `select CONCAT(c.name, ' ', c.surname)                             as fullname,
       course.name                                                as course,
       COUNT(c.id)                                                as visited,
       (select count(id) from lesson where lesson.groupId = g.id) as full,
       c.id as clientId
from course
       join \`group\` g on course.id = g.courseId
       join application a on g.id = a.groupId
       join journal j on a.id = j.applicationId
       join client c on a.clientId = c.id
where course.id = :courseId
group by applicationId
order by visited DESC
`,
            {replacements: {courseId: req.params.courseId}}
        );
        res.json({models: stat[0], count: count[0].length});
    } catch (e) {
        next(new ControllerError(e.message, 400, 'Rating controller'));
    }
};

module.exports = controller;
