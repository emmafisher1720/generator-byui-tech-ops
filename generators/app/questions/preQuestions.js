const thisFolderInfo = require('../utils/thisFolderInfo.js');
const questionTools = require('./questionTools.js');

module.exports = function () {

  var calledFromCorrectFolderQuestion = {
    name: 'calledFromCorrectFolder',
    type: 'confirm',
    message: questionTools.messagePadEnd('I have called \"yo byui-tech-ops\" from within the project folder'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: true,
    //Only ask this question when we are not talking about a new project (there is no --new flag)
    when: (!this.options.new)
  };

  var notFromAGitRepoQuestion = {
    name: 'proceedEvenThoughNotInGitRepo',
    type: 'confirm',
    message: questionTools.messagePadEnd('It seems as though you are not in a git repo (no .git file), proceed anyway?'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: true,
    //Only ask this question when we are not talking about a new project (there is no --new flag)
    //AND when we cannot find a .git file in the current folder.
    when: (!this.options.new && !thisFolderInfo.isGitRepository())
  };

  helperQuestions = [
    calledFromCorrectFolderQuestion,
    notFromAGitRepoQuestion,
  ];

  //If the user has run the generator with the --exp flag, then that user has decided to not have all the extra helper questions
  return (this.options.exp) ? [] : helperQuestions;

}
