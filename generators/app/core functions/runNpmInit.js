const proc = require('child_process');

module.exports = function () {
  return new Promise(function (success, fail) {
    var npmInit = proc.spawn('npm init', {
      stdio: ['inherit', null, 'inherit'],
      shell: true
    });

    npmInit.stdout.on('data', function (data) {
      process.stdout.write(data.toString());
    });

    npmInit.on('exit', function (code, signal) {
      success(code);
    });

    npmInit.on('error', fail);

  });
}
