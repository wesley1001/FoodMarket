var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;
var util = require('util');

module.exports = function (sequelize, DataTypes) {

    var Evaluation = sequelize.define('Evaluation', {
        text: shortDataTypes.String(),
    }, {
        timestamps: true,
        paranoid: true,
        associate: function (models) {
            models.Order.hasMany(models.Evaluation);
            models.Evaluation.belongsTo(models.Order);
        },
        instanceMethods: {
        },
        classMethods: {
        }
    });

    return Evaluation;
};

