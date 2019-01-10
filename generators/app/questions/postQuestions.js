const questionTools = require('./questionTools.js');

module.exports = function () {

  var todoListCompleteQuestion = {
    name: 'todoListComplete',
    type: 'confirm',
    message: questionTools.messagePadEnd('I have completed the above TODO list'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: true
  };


  return [
    todoListCompleteQuestion,
  ];

}
