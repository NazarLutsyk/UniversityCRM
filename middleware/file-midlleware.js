let path = require("path");
let multer = require("multer");
let mkdirp = require("mkdirp");

module.exports = function (pathToDir) {
    let diskStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            //todo add switch
            if (!pathToDir)
                pathToDir = path.join(__dirname, "../public", "upload");
            mkdirp(pathToDir, function (err) {
                if (err) return cb(e);
                else return cb(null, pathToDir);
            });
        },
        filename: function (req, file, cb) {
            try {
                let originalname = file.originalname;
                let separator = originalname.lastIndexOf(".");
                let extension = originalname.substring(separator).toLowerCase();
                let id = Math.floor(Math.random() * (1000000 - 1) + 1);
                if (extension.indexOf(".") < 0)
                    extension = "." + extension;
                let resultFilename = id + "-" + Date.now() + extension;
                return cb(null, resultFilename);
            } catch (e) {
                return cb(e);
            }
        }
    });
    return multer({storage: diskStorage});
};