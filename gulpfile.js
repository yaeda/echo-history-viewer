var gulp        = require('gulp');
var browserSync = require('browser-sync');
var useref      = require('gulp-useref');
var shell       = require('gulp-shell');
var del         = require('del');

gulp.task('font', function () {
  return gulp.src('app/bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['clean', 'font'], function () {
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  del('dist/**/*', cb);
});

gulp.task('deploy', shell.task([
  'git subtree push --prefix dist origin gh-pages'
]));

gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './app'
    }
  });
});

gulp.task('serve:dist', ['build'], function () {
  browserSync({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('default', ['serve'], function () {
  var reload = browserSync.reload;
  gulp.watch('app/scripts/**/*.js', reload);
  gulp.watch('app/styles/**/*.css', reload);
  gulp.watch('app/*.html', reload);
});
