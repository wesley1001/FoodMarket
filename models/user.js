var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name: shortDataTypes.String(),
        nickname: shortDataTypes.String(),
        headimage: shortDataTypes.Url(),
		sex: shortDataTypes.Int(),
		password: shortDataTypes.String(),
        phone: shortDataTypes.Phone(),
        unionid: shortDataTypes.String(),
        openid: shortDataTypes.String(),
        joinTime: shortDataTypes.Date(),
        status: shortDataTypes.Int(),
        flag: {
            type: DataTypes.INTEGER,
            defaultValue: 1
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

	return User;
};

