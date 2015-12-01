
module.exports = function (sequelize, DataTypes) {

	var User = sequelize.define('User', {
		// 
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		sex: {
			type: DataTypes.ENUM('male', 'female'),
			allowNull: false,
			defaultValue: 'male'
		},
		role: {
			type: DataTypes.ENUM('user', 'dev', 'admin', 'root'),
			defaultValue: 'user'
		},
		headimage: {
			type: DataTypes.STRING,
			allowNull: false,
			vialidate: {
				isUrl: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING(11),
			allowNull: false,
			validate: {
				is: '/(^$)|(^\d{11}$)/'
			}
		},
		status: {
			type: DataTypes.ENUM('unauthorized', 'normal'),
			allowNull: false,
			defaultValue: 'unauthorized'
		}
	}, {
		associate: function (models) {
		},
		instanceMethods: {
		},
		classMethods: {
		}
	});

	return User;
};

