var db = require('./index.js');
var co = require('co');


co(function * () {
    yield db.models.OrderItem.sync({force: true});
    //yield db.models.Goods.sync();
    //yield db.sync({/*force: true*/});
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});


