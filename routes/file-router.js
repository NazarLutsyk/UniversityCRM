let router = require('express').Router();
let controllers = require('../сontrollers');

router.delete('/:id',controllers.file.remove);

module.exports = router;