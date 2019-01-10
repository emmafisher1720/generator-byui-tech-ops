var questionTools = {
  messagePadEnd(string) {
    let padding = 33;
    return string.padEnd(padding);
  },

  noBlank(input) {
    if (input !== undefined && input.replace(/\s/g, '') !== '') return true;
    else return 'this cannot be left blank!';
  }
};

module.exports = questionTools;
