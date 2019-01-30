let express = require('express');
let guard = require('node-auth-guard');

let authMiddleware = require('../middleware/auth-middleware');
let ROLES = require('../config/roles');

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
let EapplicationRouter = require('./eapplication-router');
let RoleRouter = require('./role-router');
let AuthRouter = require('./auth-router');
let StatisticRouter = require('./statistic-router');
let FileRouter = require('./file-router');
let SendingRouter = require('./sending-router');
let SocialRouter = require('./social-router');

router.use('/applications', authMiddleware.isLoggedIn, ApplicationRouter);
router.use('/audiocalls', authMiddleware.isLoggedIn, AudiocallRouter);
router.use('/clients', authMiddleware.isLoggedIn, ClientRouter);
router.use('/comments', authMiddleware.isLoggedIn, CommentRouter);
router.use('/contracts', authMiddleware.isLoggedIn, ContractRouter);
router.use('/courses', authMiddleware.isLoggedIn, CourseRouter);
router.use('/groups', authMiddleware.isLoggedIn, GroupRouter);
router.use('/lessons', authMiddleware.isLoggedIn, LessonRouter);
router.use('/payments', authMiddleware.isLoggedIn, PaymentRouter);
router.use('/sources', authMiddleware.isLoggedIn, SourceRouter);
router.use('/tasks', authMiddleware.isLoggedIn, TaskRouter);
router.use('/cities', authMiddleware.isLoggedIn, CityRouter);
router.use('/eapplications', authMiddleware.isLoggedIn, EapplicationRouter);
router.use('/managers', authMiddleware.isLoggedIn, guard.roles(ROLES.BOSS_ROLE), ManagerRouter);
router.use('/roles', RoleRouter);
router.use('/auth', AuthRouter);
router.use('/statistic', authMiddleware.isLoggedIn, StatisticRouter);
router.use('/files', authMiddleware.isLoggedIn, guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), FileRouter);
router.use('/sending', authMiddleware.isLoggedIn, guard.roles(ROLES.BOSS_ROLE, ROLES.MANAGER_ROLE), SendingRouter);
router.use('/socials', authMiddleware.isLoggedIn, SocialRouter);

module.exports = router;
