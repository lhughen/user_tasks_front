var gulp = require('gulp'), concat = require('gulp-concat');

gulp.task('default', function () {
  return gulp.src('./app/assets/js/**/*.js')
    .pipe(concat('components.js'))
    .pipe(gulp.dest('./app/dist'));
});
