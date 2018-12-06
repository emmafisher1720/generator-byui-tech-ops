const { main } = require('./main.js');

function getInput() {
    var input;
    // How to get input, ie. from file, commandline, inquierer, etc.
    return input;
}

function getOutput (output) {
    // How to output data, ie. to csv, to json, to console, etc.
    return;
}

(function () {
    const input = getInput();
    const output = main(input);
    getOutput(output);
})()
