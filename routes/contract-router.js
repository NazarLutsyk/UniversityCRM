let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.contract.getAll)
    .post(controllers.contract.create);

router.route('/:id')
    .get(controllers.contract.getById)
    .put(controllers.contract.update)
    .delete(controllers.contract.remove);

module.exports = router;