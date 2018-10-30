const del 			= require('del');
const gulp 			= require('gulp');
const sass 			= require('gulp-sass');
const concat 		= require('gulp-concat');
const uglify 		= require('gulp-uglify');
const cleanCSS 		= require('gulp-clean-css');
const autoprefixer 	= require('gulp-autoprefixer');
const browserSync 	= require('browser-sync').create();

const cssFiles = [
	'./src/css/styles.css',
	'./src/css/overide.css',
];

const jsFiles = [
	'./src/js/main.js',
	'./src/js/overide.js',
];

function styles() {
	return gulp.src('./src/scss/*.scss')
			   .pipe(sass().on('error', sass.logError))
			   .pipe(concat('styles.css'))
			   .pipe(autoprefixer({
					browsers: ['> 0.1%'],
					cascade: false
			   }))
			   .pipe(cleanCSS({
			   		level: 2
			   }))
			   .pipe(gulp.dest('./build/css/'))
			   .pipe(browserSync.stream());
}

function scripts() {
	return gulp.src(jsFiles)
			   .pipe(concat('scripts.js'))
			   .pipe(uglify({
			   		toplevel: true
			   }))
			   .pipe(gulp.dest('./build/js/'))
			   .pipe(browserSync.stream());
}

function watch() {
	browserSync.init({
        server: {
            baseDir: './'
        }
    });

	gulp.watch('./src/scss/**/*.scss', styles);
	gulp.watch('./src/js/**/*.js', scripts);
	gulp.watch('./**/*.html', browserSync.reload);
}

function clean() {
	return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean,
					   		gulp.parallel(styles, scripts)
					   	));
gulp.task('dev', gulp.series('build', 'watch'));