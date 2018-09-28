let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.payment.getAll)
    .post(controllers.payment.create);

router.route('/:id')
    .get(controllers.payment.getById)
    .put(controllers.payment.update)
    .delete(controllers.payment.remove);

module.exports = router;