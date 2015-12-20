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
    var User= db.models.User;
    router.get('/user/evaluation',  function *() {
        var id= this.query.id;
        var save=0;
        this.body = yield render('phone/Evaluation', {
            id,save
        });
    });

    router.get('/user/addevaluation',  function *() {

        debug(this.query);
        this.checkQuery('text').empty().trim().toLow();
        if (this.errors) {
            this.body = this.errors;
            return;
        }

        yield Evaluation.create({
            text: this.query.text,
            OrderId: this.query.id,
            UserId:auth.user(this).id
        });

        var save=1;
        this.body = yield render('phone/Evaluation', {
            save
        });
    });


    router.get('/user/evaluations',  function *() {
        var page=this.query.page;
        var list= yield Evaluation.findAll({
            include:[User]
        });
        debug(list);
        ////一页5个
        var preurl="#";
        var nexturl="#";
        if(page==null) {
            page=0;
        }else{
            var prepage=Number(page)-1;
            if(this.url.toString().indexOf("?")>0){
                if(this.url.toString().indexOf("page")>0){
                    preurl=this.url.toString().substring(0,this.url.toString().indexOf("page"))+"page="+prepage;
                }else{
                    preurl=this.url+"&page="+prepage;
                }
            }else{
                preurl=this.url+"?page="+prepage;
            }

        }
        var l=list.length;
        var next;
        if(page*5+5<l){
            list=list.slice(page*5,page*5+5);
            next= Number(page)+1;
            if(this.url.toString().indexOf("?")>0){
                if(this.url.toString().indexOf("page")>0){
                    nexturl=this.url.toString().substring(0,this.url.toString().indexOf("page"))+"page="+next;
                }else{
                    nexturl=this.url+"&page="+next;
                }
            }else{
                nexturl=this.url+"?page="+next;
            }
        }else if(page*5+5==l) {
            list=list.slice(page*5,page*5+5);
            next=0;
        }else{
            list=list.slice(page*5);
            next=0;
        }
        this.body = yield render('phone/Evaluations', {
            preurl,nexturl,list,page,next
        });
    });


};