var gulp = require('gulp');
var sass = require('gulp-sass');
var ugfily = require('gulp-uglify');
var contat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var server = require('gulp-webserver');
var rev = require('gulp-rev');
var path = require('path');
var url = require('url');
var fs = require('fs');
//编译scss
gulp.task('devSass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android>=4.0']
        }))
        .pipe(cleanCss())
        .pipe(contat('all.css'))
        .pipe(gulp.dest('src/css'))
});
//编译css
gulp.task('bulidCss', function() {
    gulp.src('src/css/*.css')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android>=4.0']
        }))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(contat('all.css'))
        .pipe(gulp.dest('bulid/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dev/css'))
});

//编译js
gulp.task('bulidJs', function() {
    gulp.src('src/js/**/*.js')
        .pipe(ugfily())
        .pipe(contat('all.js'))
        .pipe(gulp.dest('bulid/js'))
});
//起服务
gulp.task('webServer', function() {
    gulp.src('src')
        .pipe(server({
            livereload: true,
            open: true,
            port: 8080,
            fallback: 'index.html',
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return false;
                }
                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
            }
        }))
});
gulp.task('default', ['devSass', 'bulidCss', 'bulidJs', 'webServer']);