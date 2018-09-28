let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.task.getAll)
    .post(controllers.task.create);

router.route('/:id')
    .get(controllers.task.getById)
    .put(controllers.task.update)
    .delete(controllers.task.remove);

module.exports = router;