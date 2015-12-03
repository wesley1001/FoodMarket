/**
 * Created by bian on 11/30/15.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var path = require('path');

gulp.watch('./css/seller/*.scss',function(event){
    gulp.src(path.join(event.path,'*.scss'))
        .pipe(sass())
        .pipe(gulp.dest(event.path));
});

gulp.task('default', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('one',function(){
   gulp.src('./css/seller/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css/seller/'));
});
