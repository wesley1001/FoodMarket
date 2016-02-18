var db = require('../models');
var co = require('co');

co(function *() {
     var data = yield db.models.User.findById(51);
     console.log(data.dataValues);
    var data = yield db.models.User.findAll({
        where: {
            status: {
                $in: [-1, 0, 1, 2, 3]
            }
        },
        include: [{
            model: db.models.DeliverAddress,
            where: {
                isDefault: true
            },
            include: [{
                model: db.models.Area,
                include: [{
                    model: db.models.Area,
                    as: 'TopArea'
                }]
            }]
        }],
        offset: (2 - 1) * 25 ,
        limit: 25,
        order: [['id', 'DESC']]
    });

    console.log(data.length);

    data.forEach((item) => {console.log(item.name, item.id)})
}).catch(function (err) {
    console.log(err);
});
