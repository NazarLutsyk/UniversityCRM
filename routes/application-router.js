let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.application.getAll)
    .post(controllers.application.create);

router.route('/:id')
    .get(controllers.application.getById)
    .put(controllers.application.update)
    .delete(controllers.application.remove);

module.exports = router;