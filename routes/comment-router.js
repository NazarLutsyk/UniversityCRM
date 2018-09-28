let router = require('express').Router();
let controllers = require('../сontrollers');

router.route('/')
    .get(controllers.comment.getAll)
    .post(controllers.comment.create);

router.route('/:id')
    .get(controllers.comment.getById)
    .put(controllers.comment.update)
    .delete(controllers.comment.remove);

module.exports = router;