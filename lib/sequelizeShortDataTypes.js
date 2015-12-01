/**
 * Created by me on 15-12-1.
 */

var Sequelize = require('sequelize');
var DataTypes = Sequelize;

var String = {
    type: DataTypes.STRING,
    allowNull: false
};

var Int = {
    type: DataTypes.INTEGER
};

var Phone = {
    type: DataTypes.STRING(11),
    allowNull: false,
    validate: {
        is: '/^\d{11}$/'
    }
};

module.exports = {
    String,
    Phone,
    Int
};