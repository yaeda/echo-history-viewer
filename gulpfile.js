var gulp        = require('gulp');
var browserSync = require('browser-sync');

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
