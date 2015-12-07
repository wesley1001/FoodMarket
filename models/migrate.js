var db = require('./index.js');
var co = require('co');


co(function * () {
    yield db.sync(/*{force: true}*/);
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});

