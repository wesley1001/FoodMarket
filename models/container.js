var sequelizex = require('../lib/sequelizex');
var shortDataTypes = sequelizex.DataTypes;
var util = require('util');

module.exports = function (sequelize, DataTypes) {

    var Container = sequelize.define('Container', {
        key: shortDataTypes.String(),
        value: shortDataTypes.String(),
        status: shortDataTypes.Int()
    }, {
        associate: function (models) {
        },
        instanceMethods: {
        },
        classMethods: {
            fare: function *(value, returnObj) {
                var fare;
                if(util.isNullOrUndefined(value)) {
                    fare =  yield this.findOne({
                        where: {
                            key: 'fare'
                        }
                    });
                    return returnObj ? fare : util.isNullOrUndefined(fare) ? null : JSON.parse(fare.value);
                } else {
                    fare = yield this.fare(undefined, true);
                    if (util.isNullOrUndefined(fare)) {
                        return yield this.create({
                            key: 'fare',
                            value: JSON.stringify(value)
                        });
                    } else {
                        fare.value = JSON.stringify(value);
                        return yield fare.save();
                    }
                }
            }
        }
    });

    return Container;
};

