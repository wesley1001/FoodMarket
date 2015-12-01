var shortDataTypes = require('../lib/sequelizeShortDataTypes');

module.exports = function (sequelize, DataTypes) {

    var OrderItem = sequelize.define('OrderItem', {
        /**
         * goods 对象json
         */
        goods: shortDataTypes.String,
        price: shortDataTypes.Double,
        num: shortDataTypes.Int
    }, {
        associate: function (models) {
            models.Order.hasMany(models.OrderItem);
            models.OrderItem.belongsTo(models.Order);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return OrderItem;
};

