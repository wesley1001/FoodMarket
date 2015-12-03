/* css */
require('../../../src/css/admin/index.js');

/* js */
require('../admin/index');
/* webuplader */
require('fex-webuploader/dist/webuploader.css');
var WebUploader = require('fex-webuploader');

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

    app.controller('UploadCtl', ['$scope', function (scope) {
        var imgs = [];
    }]);

    angular.bootstrap(document.documentElement, ['app']);

});









