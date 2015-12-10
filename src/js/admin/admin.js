/**
 * Created by li_rz on 2015/12/8.
 */
require('../../../src/css/admin-base/common.js');
require('./../admin-base/core.js');
require('../../../src/bower_components/jquery/dist/jquery.min.js');
require('../../../src/css/admin/checkList.scss');
// require('../../../src/bower_components/angular/angular.min.js');

(jQuery)(document).on('DOMContentLoaded', function () {
    var $show_adminer = (jQuery)('a[href="#showAdminer"]'),
        $add_adminer = (jQuery)('#addAdminer form'),
        $submit_button = $add_adminer.find('#submit'),
        assembleHTML;

    assembleHTML = function (data, append_html) {
        data.forEach(function (every_data) {
            append_html += '<div class="col-md-4">' +
                '<div class="portlet box red">' +
                '<div class="portlet-title">' +
                '<div class="caption"><i class="fa fa-cogs"></i>管理员</div>' +
                '<div class="tools"></div>' +
                '</div>' +
                '<div class="portlet-body">' +
                '<div class="table-responsive">' +
                '<table class="table table-hover">' +
                '<thead>' +
                '<tr><th>项目</th><th>内容</th></tr>' +
                '</thead>' +
                '<tbody>' +
                '<tr><th>name</th><th>'+ every_data.name +'</th></tr>' +
                '<tr><th>password</th><th>'+ every_data.password +'</th></tr>' +
                '<tr><th>phone</th><th>'+ every_data.phone +'</th></tr>' +
                '<tr><th><button class="btn btn-danger" type="button">删除该管理员</button></th></tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });

        return append_html;
    };


    $show_adminer.on('click', function () {
        var $show_admin_html = (jQuery)('#showAdminer');
        (jQuery).get('/adminer/admin.json', function (data) {
            var append_html = '';
            append_html = assembleHTML(data, append_html);
            $show_admin_html.html(append_html);
        });
    });

    $submit_button.on('click', function (event) {
        event.preventDefault();
        var user = {
                phone : (jQuery)('#phone'),
                username : (jQuery)('#account'),
                password : (jQuery)('#password'),
                confirm : (jQuery)('#confirm')
            },
            user_value = {
                phone : user.phone.val(),
                username : user.username.val(),
                password : user.password.val(),
                confirm : user.confirm.val()
            },

            $note = (jQuery)('pre.col-md-12'),
            LEGAL_PHONE = /\b([1-9])([0-9]){10}\b/,
            LEGAL_USERNAME = /\w{4,16}/,
            LEGAL_PASSWORD = /.{6,}/;

        console.log(user_value.phone, user_value.username, user_value.password);
        if (user_value.password !== user_value.confirm) {
            $note.removeClass('hide')
                 .html('两次输入密码不一');

            return false;
        }

        if (LEGAL_PHONE.test(user_value.phone) && LEGAL_USERNAME.test(user_value.username) && LEGAL_PASSWORD.test(user_value.password)) {
            (jQuery).post('/adminer/checkAdminForm', {
                username : user_value.username,
                password : user_value.password,
                phone : user_value.phone
            }, function (data) {
                if (data.success) {
                    for (var i in user) {
                        if (user.hasOwnProperty(i)) {
                            user[i].val('');
                        }
                    }
                    $note.addClass('hide')
                } else {
                    $note.removeClass('hide')
                    .html(data.error);
                }
            });
        } else {
            $note
                .removeClass('hide')
                .html('账号或密码或电话输入有误');

            return false;
        }



    });
});