let router = require('express').Router();
let controllers = require('../сontrollers');

router.get('/:courseId', controllers.rating.getByCourseId);


module.exports = router;
