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

function * goodsSeed() {
    var goodsTypes = yield db.models.GoodsType.findAll({
        where: {
            type: 2
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
            per:  i % 2 ? '每斤' : '每个',
            brief: '简介'
        })
    }
}

function * goodsTypeSeed() {
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

function * msgSeed(){
    var users = yield db.models.User.findAll({});
    for(var i = 0; i < 160; i ++) {
        yield db.models.Msg.create({
            title: '消息测试' + i,
            link: '#',
            UserId: users[i % users.length].id
        })
    }
}

function * addressSeed() {
    var users = yield db.models.User.findAll({});
    var defaults = {};
    for(var i = 0; i < 160; i ++) {
        yield db.models.DeliverAddress.create({
            recieverName: '收货人' + i,
            phone: "1884082391" + i % 10,
            province: '辽宁省',
            city: '大连市',
            area: '开发区',
            address: '大连理工大学软件学院',
            isDefault: defaults[users[i % users.length].id] ? false : true,
            UserId: users[i % users.length].id
        })
        defaults[users[i % users.length].id] = true;
    }
}

function * init() {
    yield db.sync({force: true});
    yield goodsTypeSeed();
    yield userSeed();
    yield goodsSeed();
    yield msgSeed();
    yield addressSeed();
}

co(function * () {
    console.log('finished ...');
}).catch(function () {
    console.log(arguments);
});


