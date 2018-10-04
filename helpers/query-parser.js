module.exports = () => (req, res, next) => {
    try {
        let query = {};
        query.offset = req.query.offset ? +req.query.offset : 0;
        query.limit = req.query.limit ? +req.query.limit : null;
        query.attributes = req.query.attributes ? req.query.attributes : '';
        query.order = req.query.order ? req.query.order : null;
        query.include = req.query.include ? req.query.include.split(',') : [];

        req.query = query;
    } catch (e) {
        next(e);
    }
    next();
};