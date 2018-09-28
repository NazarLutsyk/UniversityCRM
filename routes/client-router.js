let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.client.getAll)
    .post(controllers.client.create);

router.route('/:id')
    .get(controllers.client.getById)
    .put(controllers.client.update)
    .delete(controllers.client.remove);

module.exports = router;