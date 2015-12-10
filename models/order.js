var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Order = sequelize.define('Order', {
        /**
         * address 对象json
         */
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
            models.Seller.hasMany(models.Order);
            models.Order.belongsTo(models.Seller);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return Order;
};

