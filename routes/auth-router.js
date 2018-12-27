let router = require('express').Router();
let controllers = require('../сontrollers');

router.post('/login', controllers.auth.login);

router.get('/logout', controllers.auth.logout);

router.get('/principal', controllers.auth.principal);

module.exports = router;