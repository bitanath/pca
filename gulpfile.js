var gulp = require('gulp'),
    log = require('fancy-log'),
    minify = require('gulp-minifier'),
    rename = require("gulp-rename"),
    strip = require('gulp-strip-comments'),
    watch = require("gulp-watch");


gulp.task('default', function () {
    log('Done initializing gulp');
    watch(['pca.js'],{ignoreInitial:false},()=>{
        log('Reacting to changes to src files');
        gulp.src(['pca.js']).pipe(strip()).pipe(minify({minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,minifyJS:true})).pipe(rename(function(path) {
                path.extname = ".min" + path.extname;
            })).pipe(gulp.dest('.'));
    })
});