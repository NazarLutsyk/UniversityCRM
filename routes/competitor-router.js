let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.competitor.getAll)
    .post(controllers.competitor.create);

router.route('/:id')
    .get(controllers.competitor.getById)
    .put(controllers.competitor.update)
    .delete(controllers.competitor.remove);

module.exports = router;
