let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.competitorApplication.getAll)
    .post(controllers.competitorApplication.create);

router.route('/:id')
    .get(controllers.competitorApplication.getById)
    .put(controllers.competitorApplication.update)
    .delete(controllers.competitorApplication.remove);

module.exports = router;
