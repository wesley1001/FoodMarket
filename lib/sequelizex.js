/**
 * Created by me on 15-12-1.
 */

var Sequelize = require('sequelize');

var DataTypes = Sequelize;

var String = () => {
    return {
        type: DataTypes.STRING,
            allowNull: false
    }
};

var Double = () => {
    return {
        type: DataTypes.DOUBLE,
        defaultValue: 0
    }
};

var Int = () => {
    return {
        type: DataTypes.INTEGER
    }
};

var Phone = () => {
    return {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            is: /^\d{11}$/
        }
    }
};

var Url = () => {
    return {
        type: DataTypes.STRING,
        allowNull: false,
        vialidate: {
            isUrl: true
        }
    }
};

var Date = () => {
    return {
        type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
    }
};

var Bool = () => {
    return {
        type: Sequelize.BOOLEAN
    }
};

//var findById = (id) => {
//    return this.findOne({
//        where: {
//            id
//        }
//    });
//};

var val = (data) => {
    return data.map(function (item) {
        return item.dataValues;
    })
};

module.exports = {
    DataTypes: {
        String,
        Phone,
        Int,
        Url,
        Date,
        Double,
        Bool
    },
    Func: {
        //findById
        val
    }
};