const { main } = require('./main.js');

async function getInput(seed) {
    var input;
    // How to get input, eg. from file, commandline, inquierer, etc.
    return input;
}

async function getOutput (output) {
    // How to output data, eg. to csv, to json, to console, etc.
    return output;
}

function handleError (error) {
    console.error(error)
    return;
}

module.exports = function mainIO (seed) {
    let mainOutput;
    mainOutput = Promise
    .resolve ( seed )
    .then    ( getInput )
    .then    ( main )
    .then    ( getOutput )
    .catch   ( handleError );
    return mainOutput;
}
