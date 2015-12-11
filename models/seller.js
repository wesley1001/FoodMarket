var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Seller = sequelize.define('Seller', {
        name: shortDataTypes.String(),
        password: shortDataTypes.String(),
        phone: shortDataTypes.Phone(),
        province: shortDataTypes.String(),
        city: shortDataTypes.String(),
        country: shortDataTypes.String(),
        districtCode: shortDataTypes.String(),
        address: shortDataTypes.String(),
        /**
         * 店名
         */
        shopName: shortDataTypes.String(),
        /*运费 */
        fare:shortDataTypes.Int(),

        content:shortDataTypes.Int(),

        /**
         * -1 待审核
         * 0 审核通过 审核不通过直接在数据库删除资源
         */
        status: {
            type: DataTypes.INTEGER,
            defaultValue: -1
        },
        flag: {
            type: DataTypes.INTEGER,
            defaultValue: 2
        }
    }, {
        timestamps: false,
        associate: function (models) {
        },
        instanceMethods: {
        },
        classMethods: {
        },
        getterMethods: {
            fullAddress: function()  {
                return this.province + this.city + this.country + this.address;
            }
        },
    });

    return Seller;
};

