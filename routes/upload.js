var fileParse = require('co-busboy');
var fs = require('fs');
var os = require('os');
var path = require('path');
var utilx = require('../lib/util');

module.exports = (router) => {

    var uploadDir = path.join(__dirname, '..', 'public', 'upload');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    var newFileName = (filename) => {
        var ret;
        do {
            ret = path.join(uploadDir, `${utilx.randomNum(6)}-${filename}`);
        } while(fs.exists(ret));
        return ret;
    };

    router.post('/upload', function *() {

        console.log('hello');
        var parts = fileParse(this);
        var part;

        var ret = [];
        while (part = yield parts) {
            var filename = newFileName(part.filename);
            var stream = fs.createWriteStream(filename);
            part.pipe(stream);
            ret.push({
                success: true,
                filename
            });
        }

        this.body = ret.length === 1 ? ret[0] : ret;
    });


};