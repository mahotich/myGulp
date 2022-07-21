const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const htmlmin = require('gulp-htmlmin')
const include = require('gulp-file-include')
const newer=require('gulp-newer');
const browsersync = require('browser-sync').create()
const del = require('del')

const paths = {
   html: {
      src: ['src/*.html', '!src/pages/**/_*.html'],
      dest: 'dist/'
   },
   styles: {
      src: ['src/styles/**/*.sass', 'src/styles/**/*.scss'],
      dest: 'dist/css/'
   },
   scripts: {
      src: 'src/js/**/*.js',
      dest: 'dist/js/'
   },
   imgage: {
      src: 'src/img/**/*',
      dest: 'dist/img/'
   }
}

function clean() {
   return del(['dist/*', '!dist/img', '!dist/css/normalize.css'])
}

function html() {
   return src(paths.html.src)
      .pipe(include())
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest(paths.html.dest))
      .pipe(browsersync.stream())
}

function styles() {
   return src(paths.styles.src)
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(concat('style.min.css'))
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(dest(paths.styles.dest))
      .pipe(browsersync.stream())
}


function scripts() {
   return src(paths.scripts.src)
      .pipe(uglify())
      .pipe(concat('index.min.js'))
      .pipe(dest(paths.scripts.dest))
      .pipe(browsersync.stream())
}

function images() {
   return src(paths.imgage.src) 
      .pipe(newer(paths.imgage.dest))// Берём все изображения из папки источника
      .pipe(dest(paths.imgage.dest)) // Выгружаем оптимизированные изображения в папку назначения
}

function startwatch() {
   browsersync.init({
      server: {
         baseDir: "./dist"
      }
   })
   watch(paths.html.dest).on('change', browsersync.reload)
   watch(paths.html.src, html)
   watch(paths.styles.src, styles)
   watch(paths.scripts.src, scripts)
   watch(paths.imgage.src,images);
}

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.startwatch = startwatch

// Таск, который выполняется по команде gulp
exports.default = series(clean, html, parallel(styles, scripts, images), startwatch)