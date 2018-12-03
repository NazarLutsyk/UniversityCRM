let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.manager.getAll)
    .post(controllers.manager.create);

router.route('/:id')
    .get(controllers.manager.getById)
    .put(controllers.manager.update)
    .delete(controllers.manager.remove);

module.exports = router;