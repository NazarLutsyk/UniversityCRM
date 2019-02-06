module.exports = () => (req, res, next) => {
    try {
        let query = {};
        query.q = req.query.q ? JSON.parse(req.query.q) : null;
        query.offset = req.query.offset ? +req.query.offset : null;
        query.limit = req.query.limit ? +req.query.limit : null;
        query.attributes = req.query.attributes ? JSON.parse(req.query.attributes) : null;
        query.sort = req.query.sort ? [(JSON.parse(req.query.sort)).split(' ')] : null;
        query.include = req.query.include ? JSON.parse(req.query.include) : [];

        req.query = query;
    } catch (e) {
        next(e);
    }
    next();
};
