/**
 * Created by lxc on 15-12-18.
 */
var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('Area', {
        title: shortDataTypes.String(),
        /**
         * 一级类别，二级类别
         */
        type: shortDataTypes.Int(),
        /**
         * 0 => 正常
         * -1 => 已删除
         */
        status: shortDataTypes.Int()
    }, {
        timestamps: false,
        associate: function (models) {
            models.Area.hasMany(models.Area);
            models.Area.belongsTo(models.Area, {as: 'TopArea', foreignKey: 'TopAreaId', constraints: false});
        },
        instanceMethods: {},
        classMethods: {
            all: function * () {
                return yield this.findAll({
                    where: {
                        type: 1,
                        status: 0
                    },
                    include: [{
                        model: this,
                        where: {
                            status: 0
                        },
                        required: false
                    }]
                });
            }
        }
    });
};
