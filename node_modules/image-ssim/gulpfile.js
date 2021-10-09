var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sequence = require('run-sequence');

function getTask(task) {
	return require('./gulp_tasks/' + task)(gulp, plugins);
}

gulp.task('tslint', getTask('tslint'));
gulp.task('ts', getTask('typescript'));
gulp.task('doc', getTask('typedoc'));
gulp.task('browserify', getTask('browserify'));

gulp.task('build', function (done) {
	sequence('ts', 'browserify', done);
});

gulp.task('default', ['tslint', 'doc', 'build']);

gulp.task('deploy', ['default'], getTask('gh-pages'));
