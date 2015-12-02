var redis = require('redis');
var redisCoWrapper = require('co-redis');
var co = require('co');

var log = require('./log');
var globalConfig = require('./config');
var util = require('util');

var client = redis.createClient(
    globalConfig.redis.port,
    globalConfig.redis.host,
    {
        auth_pass: globalConfig.redis.pwd
    }
);

client.on('error', function (err) {
    // todo: error handle
    log.error('Error', err, new Date());
});

// add key prefix
var commands = ['set', 'setex', 'get'];

commands.forEach( function (cmd)  {
    var oldCmd = `_${cmd}`;
    client[oldCmd] = client[cmd];
    client[cmd] = function (key, arg, cb) {
        arguments[0] = `foodmarket/${arguments[0]}`;
        return client[oldCmd].apply(this, arguments);
    };
});

client.jsetex = (key, expire, val, callback) => {
    return client.set(key, expire, JSON.stringify(val), callback);
};



var redisCo = redisCoWrapper(client);
// json get
redisCo.jget = function *(key, arg) {
    var val = yield redisCo.get(key, arg);
    return util.isNullOrUndefined(val) ? val : JSON.parse(val);
};

redisCo._client = client;

module.exports = redisCo;
