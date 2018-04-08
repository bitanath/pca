var gulp = require('gulp'),
    log = require('fancy-log'),
    minify = require('gulp-minifier'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    strip = require('gulp-strip-comments'),
    watch = require("gulp-watch");

gulp.task('default', function () {
    log('Done initializing gulp');
    watch(['pca.js','svd.js'],{ignoreInitial:false},()=>{
        log('Reacting to changes to src files');
        gulp.src(['pca.js','svd.js']).pipe(concat('pca.js')).pipe(minify({minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,minifyJS:true})).pipe(rename(function(path) {
                path.extname = ".min" + path.extname;
            })).pipe(gulp.dest('.').pipe(gulp.dest('C:\\Users\\Lenovo\\Desktop\\apptools\\public\\js')));
    })
});