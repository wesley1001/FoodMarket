/**
 * Created by me on 15-12-1.
 */

var Sequelize = require('sequelize');
var DataTypes = Sequelize;

var String = {
    type: DataTypes.STRING,
    allowNull: false
};

var Double = {
    type: DataTypes.DOUBLE,
    defaultValue: 0
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

var Url = {
    type: DataTypes.STRING,
    allowNull: false,
    vialidate: {
        isUrl: true
    }
};

var Date = {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
};

module.exports = {
    String,
    Phone,
    Int,
    Url,
    Date,
    Double
};