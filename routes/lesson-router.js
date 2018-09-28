let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.lesson.getAll)
    .post(controllers.lesson.create);

router.route('/:id')
    .get(controllers.lesson.getById)
    .put(controllers.lesson.update)
    .delete(controllers.lesson.remove);

module.exports = router;