var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    var Adminer = sequelize.define('Adminer', {
        name: shortDataTypes.String(),
        password: shortDataTypes.String(),
        phone: shortDataTypes.Phone(),
        status: shortDataTypes.Int(),
        flag: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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

    return Adminer;
};

