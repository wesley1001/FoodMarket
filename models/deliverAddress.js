var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    /**
     * 收货地址
     */
    var DeliverAddress = sequelize.define('DeliverAddress', {
        /**
         * 收货人姓名
         */
        recieverName: shortDataTypes.String,
        phone: shortDataTypes.Phone,
        province: shortDataTypes.String,
        city: shortDataTypes.String,
        area: shortDataTypes.String,
        address: shortDataTypes.String
    }, {
        timestamps: false,
        associate: function (models) {
            models.User.hasMany(models.DeliverAddress);
            models.DeliverAddress.belongsTo(models.User);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return DeliverAddress;
};

