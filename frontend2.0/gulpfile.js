var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var inject = require('gulp-inject');
var tslint = require('gulp-tslint');
var gulpTraceur = require('gulp-traceur');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var react = require('gulp-react');


gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('css', function () {
    gulp.src('src/assets/css/**/*.css')
        .pipe(stylus({compress: false, paths: ['source/stylus']}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('js', function () {
    gulp.src('src/assets/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}))

    gulp.src('src/assets/js/**/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('html', function () {
    gulp.src('src/app/**/*.jade')
        .pipe(jade({basedir: './dist'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))

    gulp.src('src/app/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}))

});

gulp.task('fonts', function () {
    gulp.src('src/assets/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.reload({stream: true}))
});




gulp.task('watch', function () {

    gulp.start('css');
    gulp.start('html');
    gulp.start('js');
    gulp.start('fonts');

    gulp.watch('src/assets/css/**/*.css', ['css', browserSync.reload]);
    gulp.watch(['src/assets/js/**/*.js', 'src/assets/js/**/*.jsx'], ['js', browserSync.reload]);
    gulp.watch('src/assets/fonts/**/*', ['fonts', browserSync.reload]);
    gulp.watch('src/app/**/*.jade', ['html', browserSync.reload]);
});


gulp.task('start', ['browser-sync', 'watch']);