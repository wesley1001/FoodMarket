/**
 * Created by li_rz on 2015/12/8.
 */
require('../../../src/css/admin-base/common.js');
require('./../admin-base/core.js');
require('../../../src/bower_components/jquery/dist/jquery.min.js');
require('../../../src/css/admin/checkList.scss');
// require('../../../src/bower_components/angular/angular.min.js');

(jQuery)(document).on('DOMContentLoaded', function () {
    var $show_adminer = (jQuery)('a[href="#showAdminer"]');
    //console.log(admin_list);

    var assembleHTML = function (data, append_html) {
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
            console.log(data);
            console.log(data instanceof Array);

            append_html = assembleHTML(data, append_html);

            console.log(append_html);

            $show_admin_html.html(append_html);
        });


    });
});