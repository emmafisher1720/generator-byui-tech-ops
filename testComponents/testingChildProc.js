const proc = require('child_process');

var npmInit = proc.spawn('npm init', {
  stdio: [null, null, 'inherit'],
  shell: true
});

process.stdin.pipe(npmInit.stdin);
npmInit.stdout.on('data', function (data) {
  console.log(data.toString());

});

//console.log(npmInit.stdout.toString());
// npmInit.on('close', function (code, signal) {
//   console.log("close", code);

// });

// npmInit.on('exit', function (code, signal) {
//   console.log("exit", code);

// });

// npmInit.on('message', function () {
//   console.log("message", code);
// });

// npmInit.on('error', function () {
//   console.log("error", code);
// });

//TODO List:

//ADD commands for update, or new
//Read this: https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a
//Add a function that first checks the package Json for the defaults then implements our own default in the cli prompt.

//Lessons learned:

//it is so much better to run npm init on a real repository, so that the bugs, readme and git repo links get filled out.
