// 引入必要的资源
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    webpack = require('gulp-webpack');

// webpack任务，后面会详细介绍，这里略过
gulp.task('webpack', function () {
    var _webpackConfig = {
        watch: false,
        entry: {
            index: './src/app/App.js'
        },
        output: {
            filename: './js/bundle.js',
            chunkFilename: './js/bundle.chunk.js',
        },
        module: {
            loaders: [{
                test: /\.js[x]?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    plugins: ['transform-decorators-legacy'],
                    compact: false,
                    presets: ['es2015', 'react','stage-3']
                }
            }, {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }]
        },
        resolve: {// 现在你require文件的时候可以直接使用require('file')，不用使用require('file.coffee')
            extensions: ['', '.js', '.json', '.coffee']
        }
    };
        gulp.src('src/**/*.js')
        .pipe(webpack(_webpackConfig)).pipe(gulp.dest('dist/'));
    gulp.watch('src/**/*.js',function () {
        gulp.src('src/**/*.js')
            .pipe(webpack(_webpackConfig)).pipe(gulp.dest('dist/'));
    })
});

/**
 * sass任务
 * 编译/src/sass目录下所有后缀为.scss的文件，并将编译好的文件放置到/dist/css目录下
 **/
/*gulp.task('sass', function () {
    return gulp.src('./src/sass/!**!/!*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});*/

/**
 * static任务
 * 主要负责将静态文件放置到/dist/*目录下
 **/
gulp.task('static', function () {
    gulp.src('./src/fonts/!**!/!*.*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./src/images/!**!/!*.*')
        .pipe(gulp.dest('./dist/images'));
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist'));
});

/**
 * 把 webpac sass static 任务打包，
 * 这样在执行gulp的时候，就会自动执行webpack，sass，static任务
 */
gulp.task('default', ['webpack','static','browser-sync'], function () {});

// 监控相应的目录，这样在文件被修改时，gulp会自动执行相应的任务
gulp.watch('src/fonts/**/*.*', ['static']);
gulp.watch('src/images/**/*.*', ['static']);
gulp.watch('src/index.html', ['static']);

/**
 *  自己手动搭建服务
 * */
gulp.task('browser-sync', function () {
    var files = [
        'dist/*.html',
        'dist/css/*.css',
        'dist/js/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch('dist/js/*.js').on('change', browserSync.reload);
});