var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Goods = sequelize.define('Goods', {
        title: shortDataTypes.String(100),
        /**
         * 主图
         */
        mainImg: shortDataTypes.String(),
        /**
         * 图片链接数组的json串
         * [url, url, url]
         */
        imgs: shortDataTypes.String(),
        /**
         * 现价
         */
        price: shortDataTypes.Double(),
        /**
         * 原价
         */
        oldPrice: shortDataTypes.Double(),
        /**
         * 规格
         */
        per: shortDataTypes.String(100),
        /**
         * 已售数量
         */
        soldNum: shortDataTypes.Int(),
        /**
         * 简要描述
         */
        brief: shortDataTypes.String(100),
        /**
         *
         */
        vipDiscount: shortDataTypes.Double(1),
        /**
         * 剩余量
         */
        capacity: shortDataTypes.Int(),
        content: {
            type: DataTypes.TEXT
        },
        /**
         * -1 已删除
         * 0 下架
         * 1 已上架
         */
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        paranoid: true,
        associate: function (models) {
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return Goods;
};

