/**
 * Created by lxc on 15-12-18.
 */
var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Area = sequelize.define('Area', {
        title: shortDataTypes.String(),
        /**
         * 一级类别，二级类别
         */
        type: shortDataTypes.Int()
    }, {
        timestamps: false,
        associate: function (models) {
            models.Area.hasMany(models.Area);
            models.Area.belongsTo(models.Area);
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

    return Area;
};
