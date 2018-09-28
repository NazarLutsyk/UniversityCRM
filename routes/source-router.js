let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.source.getAll)
    .post(controllers.source.create);

router.route('/:id')
    .get(controllers.source.getById)
    .put(controllers.source.update)
    .delete(controllers.source.remove);

module.exports = router;