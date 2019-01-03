let router = require('express').Router();
let authMiddleware = require('../middleware/auth-middleware');
let controllers = require('../сontrollers');

router.post('/login', authMiddleware.isNotLoggedIn, controllers.auth.login);

router.get('/logout', authMiddleware.isLoggedIn, controllers.auth.logout);

router.get('/principal', controllers.auth.principal);

module.exports = router;