const gulp = require('gulp'),
    spawn = require('child_process').spawn;
let node;

/**
 * gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', () => {
  if (node) node.kill();

  node = spawn('node', ['server.js'], {stdio: 'inherit'});
  node.on('close', (code) => {
    if (code === 8) gulp.log('Error detected, waiting for changes...');
  });
});

/**
 * gulp
 * description: start the development environment
 */
gulp.task('watch', () => {
  gulp.run('server');
  gulp.watch(['./server.js', './app/**/*.js'], () => gulp.run('server'))
});

// Clean up if an error goes unhandled.
process.on('exit', () => {
    if (node) node.kill();
});