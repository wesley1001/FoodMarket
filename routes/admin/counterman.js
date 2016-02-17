'use strict';
var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug.js');

module.exports = (router) => {

    var Adminer = db.models.Adminer;
    var User = db.models.User;
    var Area = db.models.Area;
    var DeliverAddress = db.models.DeliverAddress;

    router.get('/adminer/user-assign',  function *() {
        var areas = yield Area.findAll({
            where: {
                type: 1
            }
        });
        var counterman = yield Adminer.findAll({
            where: {
                type: 3,
                status: 0
            }
        });
        this.body = yield render('admin/user-assign', {
            areas,
            counterman
        });
    });

    router.post('/adminer/get-user', function *() {

        var body = this.request.body;

        if (!body.page || body.page < 0) {
            body.page = 1;
        }
        body.page = parseInt(body.page);

        if (!body.limit || body.limit < 0) {
            body.limit = 25;
        }
        body.limit = parseInt(body.limit);

        var conditions = {
            where: {
                status: body.status ? body.status : {
                    in: [-1, 0, 1, 2, 3]
                }
            },
            include: [{
                model: DeliverAddress,
                where: {
                    isDefault: true
                },
                include: [{
                    model: Area,
                    include: [{
                        model: Area,
                        as: 'TopArea'
                    }]
                }]
            }],
            offset: (body.page - 1) * body.limit,
            limit: body.limit
        };


        if (body.startDate) {

            conditions.where.joinTime = {
                between: [new Date(Date.parse(body.startDate)), body.endDate ? new Date(Date.parse(body.endDate)) : new Date(Date.now())]
            };
        }

        if (body.name) {
            conditions.where.name = body.name;
        }

        if (body.phone) {
            conditions.where.phone = body.phone;
        }

        if (body.areas && body.areas.length !== 0) {
            conditions.include[0].include[0].where = {
                AreaId: {
                    in: body.areas
                }
            };
        }

        var num = 0;
        if (body.first) {
            num= yield User.count(conditions);
        }


        conditions.include.push(Adminer);

        var users = yield User.findAll(conditions);

        this.body = {
            num,
            users
        };
    });

    router.post('/adminer/user-assign', function *() {

        this.checkBody('ids').notEmpty();
        this.checkBody('adminerId').notEmpty();

        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var body = this.request.body;

        var users = yield User.findAll({
            where: {
                id: {
                    $in: body.ids
                }
            }
        });

        var tasks = [];

        for (var i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.status === -1) {
                user.status = 0;
            }
            user.AdminerId = body.adminerId;
            cache.jsetex(`/${1}/${user.id}`, 60 * 60 * 24, user);
            tasks.push(user.save());
        }

        yield tasks;

        this.body = yield Adminer.findById(body.adminerId);
    });

};
