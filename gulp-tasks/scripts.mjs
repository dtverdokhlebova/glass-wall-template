import gulp from 'gulp'
import eslint from 'gulp-eslint-new'
import filter from 'gulp-filter'
import browsersync from 'browser-sync'

export default function scripts() {
  return gulp.src('src/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulp.dest('build/js'))
    .pipe(gulp.src('src/**/*.js')) // библиотеки
    .pipe(filter('src/libs/**/*.js'))
    .pipe(gulp.dest('build'))
    .on('end', browsersync.reload)
}
