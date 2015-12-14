var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Goods = sequelize.define('Goods', {
        title: shortDataTypes.String(),
        /**
         * 主图
         */
        mainImg: shortDataTypes.Url(),
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
        per: shortDataTypes.String(),
        /**
         * 已售数量
         */
        soldNum: shortDataTypes.Int(),
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
            models.Seller.hasMany(models.Goods);
            models.Goods.belongsTo(models.Seller);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return Goods;
};

