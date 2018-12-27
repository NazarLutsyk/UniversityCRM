let passport = require('passport');
let {LocalSignIn} = require('./local-strategy');
let db = require('../../db/models');

passport.serializeUser(function (manager, done) {
    done(null, manager.id);
});
passport.deserializeUser(async function (id, done) {
    try {
        let manager = await db.manager.findById(id);
        return done(null, manager);
    } catch (e) {
        return done(e);
    }
});

passport.use('local.signin', LocalSignIn);