/**
 * Created by bian on 15-12-3.
 */

var should = require('should');
var request = require('co-supertest');
var req = require('superagent');
var app = require('../index');

request = request(app);

describe('test router',function(){
    it('should be 200',function *(){
        yield request
            .get('/seller/login')
            .expect(200)
            .end();
    });
});


describe('test router',function(){
    it('should login success',function *(){
        var res = yield request
                .post('/seller/login')
                .send({
                    phone:'18340861711',
                    password:'Test'
                })
                .expect(200)
                .expect(function(res) {
                    console.log(res.body);
                })
                .end();
        console.log(res);
    });
});

//
//describe('User register',function(){
//    it('should reture 1',function *(){
//        yield request
//            .post('/seller/register')
//            .send({
//                name:'Test',
//                password:'Test',
//                phone:'18340861711',
//                type:1,
//                address:'Test',
//                shopName:'Test'
//            })
//            .expect(200)
//            .end();
//    });
//});

