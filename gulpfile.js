'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require("gulp-babel");


gulp.task('sass', function() {
    return gulp.src('./src/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 7 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dest'))
})

gulp.task("build", function() {
    return gulp.src("./src/js/*.js")
      .pipe(babel({
      }))
      .pipe(gulp.dest("./dest/js"));
  });
  
gulp.task('default', function() {
    gulp.watch('./src/styles/**/*.scss', ['sass']);
    gulp.watch('./src/js/**/*.js', ['build']);
});