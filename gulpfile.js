const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const htmlmin = require('gulp-htmlmin')
const include = require('gulp-file-include')
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
   }
}

function clean() {
   return del(['dist/*', '!dist/img'])
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
      .pipe(concat('style.css'))
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(dest(paths.styles.dest))
      .pipe(browsersync.stream())
}


function scripts() {
   return src(paths.scripts.src)
      .pipe(uglify())
      .pipe(concat('index.js'))
      .pipe(dest(paths.scripts.dest))
      .pipe(browsersync.stream())
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
}

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.startwatch = startwatch

// Таск, который выполняется по команде gulp
exports.default = series(clean, html, parallel(styles, scripts), startwatch)