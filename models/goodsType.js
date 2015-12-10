var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var GoodsType = sequelize.define('GoodsType', {
        title: shortDataTypes.String(),
        /**
         * 一级类别，二级类别
         */
        type: shortDataTypes.Int()
    }, {
        timestamps: false,
        associate: function (models) {
            models.GoodsType.hasMany(models.GoodsType);
            models.GoodsType.belongsTo(models.GoodsType);
            models.GoodsType.hasMany(models.Goods);
            models.Goods.belongsTo(models.GoodsType);
        },
        instanceMethods: {
        },
        classMethods: {
            all: function * () {
                return yield this.findAll({
                    where: {
                        type: 1
                    },
                    include: [this]
                });
            }
        }
    });

    return GoodsType;
};

