let db = require('../models');

db.sequelize.sync({force: true, hooks: true});