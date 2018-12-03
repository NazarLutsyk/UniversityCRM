let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.city.getAll)
    .post(controllers.city.create);

router.route('/:id')
    .get(controllers.city.getById)
    .put(controllers.city.update)
    .delete(controllers.city.remove);

module.exports = router;