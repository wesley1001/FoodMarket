var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Order = sequelize.define('Order', {
        /**
         * address 对象json
         */
        recieverName: shortDataTypes.String(),
        phone: shortDataTypes.Phone(),
        province: shortDataTypes.String(),
        city: shortDataTypes.String(),
        area: shortDataTypes.String(),
        address: shortDataTypes.String(),
        price: shortDataTypes.Double(),
        num: shortDataTypes.Int(),
        /**
         * 0 => 新建订单
         */
        status: shortDataTypes.Int(),
        /**
         * 留言
         */
        message: shortDataTypes.String(),
        payTime: shortDataTypes.Date(),
        sendTime: shortDataTypes.Date(),
        recieveTime: shortDataTypes.Date()
    }, {
        associate: function (models) {
            models.User.hasMany(models.Order);
            models.Order.belongsTo(models.User);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return Order;
};

