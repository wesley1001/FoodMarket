var db = require('./index.js');
var co = require('co');


co(function * () {
    yield db.sync({force: true});
    var cities = [
        { province: '广东省', city: '广州市', country: '越秀区'},
        { province: '广东省', city: '广州市', country: '花都区'},
        { province: '辽宁省', city: '大连市', country: '开发区'},
        { province: '辽宁省', city: '大连市', country: '中山区'}
    ];
    for(var i = 0; i < 40; i ++) {
        yield db.models.Seller.create({
            name: '店长' + i,
            password: '123456',
            phone: '18840823910',
            address: '好地方',
            shopName: '店铺' + i,
            province: cities[i % 4].province,
            city: cities[i % 4].city,
            country: cities[i % 4].country,
            districtCode: '210251',
            fare: 10,
            content: 40
        })
    }
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});

