/**
 * Created by lxc on 15-12-19.
 */

var auth = require('../../helpers/auth.js');
var db = require('../../models/index.js');
var render = require('../../instances/render.js');
var debug = require('../../instances/debug');
var sequelize = require('sequelize');




module.exports = (router) => {
    var Evaluation = db.models.Evaluation;

    router.get('/user/evaluation',  function *() {
        var id= this.query.id;
        this.body = yield render('phone/Evaluation', {
            id
        });
    });

    router.get('/user/addevaluation',  function *() {
        this.checkQuery('text').empty().trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }

        yield Evaluation.create({
            text: this.query.text,

            OrderId: this.query.id
        });
        this.body = this.query.id;
    });


};