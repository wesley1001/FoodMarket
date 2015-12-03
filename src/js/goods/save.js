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
        scope.imgs.toString = function () {
            return JSON.stringify(this);
        };
        scope.mainImg = 0;

        scope.setMain = function (index) {
            scope.mainImg = index;
        };


        uploader.on('fileQueued', function (file) {
            uploader.makeThumb( file, function( error, ret ) {
                if ( error ) {
                    alert('预览失败，请刷新重试');
                } else {
                    scope.imgs.push(ret);
                    scope.$apply();
                }
            }, 640, 260);
        });
        window.s = scope;
    }]);



    angular.bootstrap(document.documentElement, ['app']);
});









