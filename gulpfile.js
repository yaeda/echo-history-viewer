var gulp        = require('gulp');
var browserSync = require('browser-sync');
var useref      = require('gulp-useref');
var deploy      = require('gulp-gh-pages');

gulp.task('build', function () {
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
})

gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(deploy());
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: './app'
    }
  });
});

gulp.task('default', ['browser-sync'], function () {
  var reload = browserSync.reload;
  gulp.watch('app/scripts/**/*.js', reload);
  gulp.watch('app/styles/**/*.css', reload);
  gulp.watch('app/*.html', reload);
});
