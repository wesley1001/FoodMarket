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

var redisCo = redisCoWrapper(client);

client.on('error', function (err) {
    // todo: error handle
    log.error('Error', err, new Date());
});

// add key prefix
var commands = ['get', 'set'];

commands.forEach( (cmd) => {
    var oldCmd = `_${cmd}`;
    client[oldCmd] = client[cmd];
    client[cmd] = (key, arg, callback) => {
        key = `oureda/foundation${key}`;
        client[coldCmd](key, arg, callback);
    };
});

// json get
client.jget = (key, arg) => {
    var val;
    co(function * ( ) {
        val = yield client.get(key, arg);
    });
    return util.isNullOrUndefined(val) ? val : JSON.parse(val);
};

// json setex
client.jsetex = (key, expire, val, callback) => {
    return client.set(key, expire, JSON.stringify(val), callback);
};

redisCo._client = client;

module.exports = redisCo;
