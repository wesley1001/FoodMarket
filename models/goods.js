var shortDataTypes = require('../lib/sequelizeShortDataTypes');

module.exports = function (sequelize, DataTypes) {

    var Goods = sequelize.define('Goods', {
        title: shortDataTypes.String,
        /**
         * 主图
         */
        mainImg: shortDataTypes.Url,
        /**
         * 图片链接数组的json串
         * [url, url, url]
         */
        imgs: shortDataTypes.String,
        price: shortDataTypes.Double,
        /**
         * 已售数量
         */
        soldNum: shortDataTypes.Int,
        capacity: shortDataTypes.Int,
        content: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: false,
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

