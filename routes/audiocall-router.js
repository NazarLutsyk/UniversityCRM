let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.audiocall.getAll)
    .post(controllers.audiocall.create);

router.route('/:id')
    .get(controllers.audiocall.getById)
    .put(controllers.audiocall.update)
    .delete(controllers.audiocall.remove);

module.exports = router;