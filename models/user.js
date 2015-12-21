var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;

module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		name: shortDataTypes.String(),
        nickname: shortDataTypes.String(),
        headimage: shortDataTypes.Url(),
		sex: shortDataTypes.Int(),
        phone: shortDataTypes.Phone(true),
        openid: shortDataTypes.String(),
        joinTime: shortDataTypes.Date(),
		/**
		 * - 3 deleted
		 * -2 information needed to be updated
		 * -1 unassigned
		 * 0 assigned
		 * 1 checked
		 */
        status: {
			type: DataTypes.INTEGER,
			defaultValue: -2
		}
	}, {
        timestamps: false,
		associate: function (models) {
			models.Adminer.hasMany(models.User);
			models.User.belongsTo(models.Adminer);
		},
		instanceMethods: {
		},
		classMethods: {
		}
	});

	return User;
};

