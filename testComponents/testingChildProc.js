const proc = require('child_process');

var npmInit = proc.spawn('npm iniasdft', { stdio: 'inherit', shell: true});
npmInit.on('close', function(code, signal) {
    console.log("close", arguments);

});

npmInit.on('exit', function(code, signal) {
    console.log("exit", arguments);

});

npmInit.on('message', function() {
    console.log("message", arguments);
});

npmInit.on('error', function() {
    console.log("error", arguments);
});

//TODO List:

//ADD commands for update, or new
//Read this: https://medium.freecodecamp.org/node-js-child-processes-everything-you-need-to-know-e69498fe970a
//Add a function that first checks the package Json for the defaults then implements our own default in the cli prompt.