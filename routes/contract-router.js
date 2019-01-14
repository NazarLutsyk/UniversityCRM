let router = require('express').Router();
let controllers = require('../сontrollers');

//todo guards

router.route('/')
    .get(controllers.contract.getAll);

router.route('/:id')
    .get(controllers.contract.getById)
    .put(controllers.contract.update)
    .delete(controllers.contract.remove);

router.post('/:applicationId', controllers.contract.create);

module.exports = router;