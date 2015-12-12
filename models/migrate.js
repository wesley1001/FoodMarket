var db = require('./index.js');
var co = require('co');


function * userSeed(){
    for(var i = 0; i < 40; i ++) {
        yield db.models.User.create({
            name: '用户' + i,
            password: '123456',
            phone: '18840823910',
            nickname: '用户' + i,
            headimage: 'http://www.baidu.com',
            sex: 0,
            unionid: 'unionid',
            openid: 'openid',
            joinTime: Date.now(),
        })
    }
}

function * sellerSeed(){
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
}

function * goodsSeed() {
    var goodsTypes = yield db.models.GoodsType.findAll({
        where: {
            type: 2
        }
    });
    var sellers = yield db.models.Seller.findAll({
        where: {
            status: 0
        }
    });
    for(var i = 0; i < 40; i ++) {
        yield db.models.Goods.create({
            title: '商品' + i,
            mainImg: '/tmp/1 (1).jpg',
            imgs: '["/tmp/1 (2).jpg", "/tmp/1 (3).jpg"]',
            price: 20 + i,
            oldPrice: 10 + i,
            capacity: 20 + i,
            content: '内容' + i,
            GoodsTypeId: goodsTypes[i % goodsTypes.length].id,
            SellerId: sellers[i % sellers.length].id,
        })
    }
}

function * goodsTypeSeed() {
    //yield db.models.GoodsType.sync({force: true});
    var ids = [];
    ids.push(yield db.models.GoodsType.create({
        title: '时令水果',
        type: 1
    }));
    ids.push(yield db.models.GoodsType.create({
        title: '新鲜蔬菜',
        type: 1
    }));
    ids.push(yield db.models.GoodsType.create({
        title: '禽蛋肉类',
        type: 1
    }));
    yield db.models.GoodsType.create({
        title: '禽蛋肉类',
        type: 1
    });
    yield db.models.GoodsType.create({
        title: '叶菜类',
        type: 2,
        GoodsTypeId: ids[0].id
    });
    yield db.models.GoodsType.create({
        title: '根茎类',
        type: 2,
        GoodsTypeId: ids[0].id
    });
    yield db.models.GoodsType.create({
        title: '豆类',
        type: 2,
        GoodsTypeId: ids[0].id
    });
    yield db.models.GoodsType.create({
        title: '精品类',
        type: 2,
        GoodsTypeId: ids[1].id
    });
    yield db.models.GoodsType.create({
        title: '热带类',
        type: 2,
        GoodsTypeId: ids[1].id
    });
    yield db.models.GoodsType.create({
        title: '苹果类',
        type: 2,
        GoodsTypeId: ids[1].id
    });
}

co(function * () {

    yield userSeed();
    //yield goodsTypeSeed();
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});

