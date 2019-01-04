let db = require('../models');

db.sequelize.sync({force: false});