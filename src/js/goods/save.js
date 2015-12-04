/* css */
require('../../../src/css/admin-base/common.js');
require('fex-webuploader/dist/webuploader.css');
require('../../../src/css/lib/webuploader.scss');
require('../../../src/css/img-upload-thumbnail.scss');
require('simditor/styles/simditor.css');

/* js */
require('../admin/index');
/* webuplader */

var WebUploader = require('fex-webuploader');
require('imports?$=jquery!simple-module');
require('imports?$=jquery!simple-hotkeys');
require('imports?$=jquery!simple-uploader');
var Simditor = require('imports?$=jquery!simditor/lib/simditor.js');
require('exports?window.angular!angular');
require('imports?$=jquery!jquery-validation');


var $ = jQuery;
$(function () {
    var app = angular.module('app', []);

    var uploader = new WebUploader.Uploader({
        swf: '/dist/Uploader.swf',
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        pick: {
            id: '#upload-picker',
            multiple: true
        },
        fileSizeLimit: 1024 * 1024 * 3,
        fileNumLimit: 10,
        server: '/upload'
    });


    var editor = new Simditor({
        textarea: $('#editor'),
        upload: {
            url: '/upload',
            fileKey: 'file',
            params: null,
            connectionCount: 3,
        }

        //optional options
    });

    app.controller('UploadCtl', ['$scope', function (scope) {
        scope.imgs = [];

        scope.data = [];
        scope.mainImg = 0;

        scope.setMain = function (index) {
            scope.mainImg = index;
        };

        scope.remove = function (index) {
            scope.data.splice(index, 1);
            scope.imgs.splice(index, 1);
        };

        scope.init = function (jobj) {
            scope.data = JSON.parse(jobj);
            scope.imgs = scope.data.slice();
        };

        uploader.on('fileQueued', function (file) {
            uploader.makeThumb( file, function( error, ret ) {
                if ( error ) {
                    alert('预览失败，请刷新重试');
                } else {
                    scope.imgs.push(ret);
                    scope.data.push(file);
                    scope.$apply();
                }
            }, 640, 260);
        });

        uploader.on('uploadSuccess', function (file, ret) {
            for(var i in scope.data) {
                var ele = scope.data[i];
                if (ele.id && ele.id == file.id) {
                    scope.imgs[i] = ret.file_path;
                    break;
                }
            }
        });

        uploader.on('uploadFinished', function () {
            scope.$applyAsync();
        });


        var $form = $('#form_sample_1');

        $form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                title: {
                    required: true
                },
                price: {
                    required: true,
                    number: true
                },
                capacity: {
                    required: true,
                    number: true
                },
                content: {
                    required: true
                }
            },

            messages: {
                title: {
                    required: '请填写标题'
                },
                price: {
                    required: '请填写价格',
                    number: '请填写数字'
                },
                capacity: {
                    required: '请填写价格',
                    number: '请填写整数'
                }
            },

            invalidHandler: function (event, validator) {
            },

            highlight: function (element) {
                $(element)
                    .closest('.form-group').addClass('has-error');
            },

            unhighlight: function (element) {
                $(element)
                    .closest('.form-group').removeClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label
                    .closest('.form-group').removeClass('has-error'); // set success class to the control group
            },

            submitHandler: function (form) {
                uploader.upload();
                form.submit();
            }
        });

    }]);



    angular.bootstrap(document.documentElement, ['app']);
});









