var gulp = require('gulp');
var minify = require('gulp-minify');
 
gulp.task('minify', function() {
  gulp.src('lib/*.js')
    .pipe(minify({
        ext:{            
            min:'-min.js'
        },
        exclude: [],
        ignoreFiles: ['gulpfile.js', '-min.js'],
		mangle: true,
		noSource: true,
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('default', [ 'minify' ]);