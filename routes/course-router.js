let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.course.getAll)
    .post(controllers.course.create);

router.route('/:id')
    .get(controllers.course.getById)
    .put(controllers.course.update)
    .delete(controllers.course.remove);

module.exports = router;