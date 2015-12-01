var shortDataTypes = require('../lib/sequelizeShortDataTypes');

module.exports = function (sequelize, DataTypes) {

    var Order = sequelize.define('Order', {
        /**
         * address 对象json
         */
        address: shortDataTypes.String,
        price: shortDataTypes.Double,
        num: shortDataTypes.Int,
        status: shortDataTypes.Int,
        /**
         * 留言
         */
        message: shortDataTypes.String,
        payTime: shortDataTypes.Date,
        sendTime: shortDataTypes.Date,
        recieveTime: shortDataTypes.Date
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

