var cache = require('../instances/cache.js');
var co = require('co');

co(function *() {
    var a = yield cache.jget('123');
    console.log(a);
});


