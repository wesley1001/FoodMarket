var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

    return sequelize.define('Adminer', {
        /**
         * 登录名，不可重复
         */
        nickname: shortDataTypes.String(),
        /***
         * 真实姓名
         */
        name: shortDataTypes.String(),
        password: shortDataTypes.String(),
        phone: shortDataTypes.Phone(),
        status: shortDataTypes.Int(),
        /**
         * 管理员类型
         * 1普通管理员
         * 2运营员
         * 3业务员
         * 100超级管理员
         */
        type: shortDataTypes.Int()
    }, {
        timestamps: false,
        associate: function (models) {
        },
        instanceMethods: {},
        classMethods: {}
    });
};

