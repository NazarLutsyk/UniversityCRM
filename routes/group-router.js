let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.group.getAll)
    .post(controllers.group.create);

router.route('/:id')
    .get(controllers.group.getById)
    .put(controllers.group.update)
    .delete(controllers.group.remove);

module.exports = router;