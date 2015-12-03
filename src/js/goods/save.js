/* css */
require('../../../src/css/admin/index.js');

/* js */
require('../admin/index');
var WebUploader = require('fex-webuploader');

var uploader = WebUploader.Uploader({
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







