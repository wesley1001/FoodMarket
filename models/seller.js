var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Seller = sequelize.define('Seller', {
        name: shortDataTypes.String,
        pwd: shortDataTypes.String,
        phone: shortDataTypes.Phone,
        address: shortDataTypes.String,
        /**
         * 店名
         */
        shopName: shortDataTypes.String,
        /**
         * 类型
         * 目前为两种 百货店铺 超市店铺
         */
        type: shortDataTypes.Int,
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
        }
    });

    return Seller;
};

