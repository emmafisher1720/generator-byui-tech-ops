const proc = require('child_process');
const test = require('inquirer')






// var npmInit = proc.spawn('npm init', {
//   stdio: [null, null, 'inherit'],
//   shell: true
// });

// process.stdin.pipe(npmInit.stdin);
// npmInit.stdout.on('data', function (data) {
//   console.log(data.toString());

// });

// var keywordsQuestion = {
//   name: 'keywords',
//   type: 'input',
//   message: 'List keywords to add separated by commas',
//   suffix: ':',
//   // TODO: fix the keywords filter.
//   // This filter gives an error.
//   filter: (input, answerHash) => {
//     var array = input.split(',');
//     return "Hello World";
//   }
// };

// var questions = [keywordsQuestion];

// test.prompt(questions).then(console.log);



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
