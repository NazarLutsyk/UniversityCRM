let express = require('express');
let router = express.Router();

let ApplicationRouter = require('./application-router');
let AudiocallRouter = require('./audiocall-router');
let ClientRouter = require('./client-router');
let CommentRouter = require('./comment-router');
let ContractRouter = require('./contract-router');
let CourseRouter = require('./course-router');
let GroupRouter = require('./group-router');
let LessonRouter = require('./lesson-router');
let PaymentRouter = require('./payment-router');
let SourceRouter = require('./source-router');
let TaskRouter = require('./task-router');
let CityRouter = require('./city-router');
let ManagerRouter = require('./manager-router');
let RoleRouter = require('./role-router');

router.use('/applications', ApplicationRouter);
router.use('/audiocalls', AudiocallRouter);
router.use('/clients', ClientRouter);
router.use('/comments', CommentRouter);
router.use('/contracts', ContractRouter);
router.use('/courses', CourseRouter);
router.use('/groups', GroupRouter);
router.use('/lessons', LessonRouter);
router.use('/payments', PaymentRouter);
router.use('/sources', SourceRouter);
router.use('/tasks', TaskRouter);
router.use('/cities', CityRouter);
router.use('/managers', ManagerRouter);
router.use('/roles', RoleRouter);

module.exports = router;


module.exports = router;
