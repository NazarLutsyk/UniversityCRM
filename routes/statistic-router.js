let router = require('express').Router();
let controllers = require('../сontrollers');

router.get('/city-manager', controllers.statistic.cityManager);
router.get('/city-application', controllers.statistic.cityApplication);
router.get('/source-application', controllers.statistic.sourceApplication);
router.get('/course-application', controllers.statistic.courseApplication);
router.get('/group-journal', controllers.statistic.groupJournal);
router.get('/competitor-application', controllers.statistic.competitorApplications);

module.exports = router;
