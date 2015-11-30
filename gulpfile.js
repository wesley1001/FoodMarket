var gulp = require('gulp');
// middlewares
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var watch = require('gulp-watch');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');
var gutil = require('gulp-util');
var pathGenerator = function (path, files, ext) {
    for (var i = 0; i < files.length; i ++) {
        files[i] = path + files[i] + ext;
    }
    return files;
};
gulp.task('copy', function () {
    // image
    gulp.src([
        './src/bower_components/semantic/dist/themes/**'
    ]).pipe(gulp.dest('public/css/themes'));
});

gulp.task('app.css', function () {
    var path = {
        css: './src/css/'
    };
    var files = [
        'common',
        'app'
    ];
    files = pathGenerator(path.css, files, '.css');
    files.splice(0, 0,
        './src/bower_components/semantic/dist/semantic.css',
        './src/bower_components/codemirror/lib/codemirror.css',
        './src/bower_components/codemirror/addon/fold/foldgutter.css'
    );
    gulp.src(files)
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./public/css/'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('app.js', function () {
    watch('src/js/*.js', function () {
        webpack(webpackConfig, function(err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                // output options
            }));
        });
    });
});


gulp.task('default', ['copy', 'app.css']);