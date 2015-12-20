var util = require('util');

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');

module.exports = (router) => {

    var Seller = db.models.Seller;
    var User = db.models.User;

    router.get('/adminer/user-list',  function *() {
        this.body = yield render('admin/user-list.html');
    });

    router.post('/adminer/user-admin-action', function *() {

        this.checkBody('id').notEmpty();
        this.checkBody('status').notEmpty();

        var body = this.request.body;
        if (this.errors) {
            this.body = this.errors;
            return;
        }

        var status = body.status;
        if (status == 0) {
            yield User.update({
                status: 0
            }, {
                where: {
                    id: body.id
                }
            });
        } else if (status == -2) {
            yield User.destroy({
                where: {
                    id: body.id
                }
            });
        }

        this.body = {
            status: true
        };

    });

    router.get('/adminer/user-admin/:status',  function *() {

        this.checkParams('status').notEmpty().isInt().toInt();
        if(this.errors) {
            this.body = this.errors;
            return;
        }
        var data = yield User.findAll({
            where: {
                status: this.params.status,
                AdminerId:auth.user(this).id
            },
            attributes: ['id', 'name', 'nickname', 'phone', 'joinTime', 'status']
        });
        this.body = data;
    });

};