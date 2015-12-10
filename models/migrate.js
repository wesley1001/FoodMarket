var db = require('./index.js');
var co = require('co');


co(function * () {
    yield db.sync({force: true});
    for(var i = 0; i < 10; i ++) {
        yield db.models.Seller.create({
            name: '店张' + i,
            password: '店张' + i,
            phone: '18840823910',
            address: '好地方',
            shopName: '店铺' + i,
            province: '辽宁省',
            city: '大连市',
            country: '开发区',
            districtCode: '210251',
        })
    }
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});

