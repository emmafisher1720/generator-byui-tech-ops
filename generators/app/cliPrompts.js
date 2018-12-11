const thisFolderInfo = require('./thisFolderInfo.js');

function messagePadEnd(string) {
  let padding = 33;
  return string.padEnd(padding);
}

function noBlank(input, answerHash) {
  if (input !== undefined && input.replace(/\s/g, '') !== '') return true;
  else return 'this cannot be left blank!';
}

module.exports = function () {

  var titleQuestion = {
    name: 'title',
    type: 'input',
    message: messagePadEnd('Project Name'),
    suffix: ':',
    validate: noBlank,

  };

  var repositoryNameQuestion = {
    name: 'repositoryName',
    type: 'input',
    message: messagePadEnd('Enter EXACT name of your Repository Please Manually Verify'),
    suffix: ':',
    validate: noBlank,
    when: () => this.options.new,
    default: (answerHash) => {
      if (thisFolderInfo.isGitRepository()) {
        return thisFolderInfo.currentDirName();
      }
      return;
    }
  };

  var versionQuestion = {
    name: 'version',
    type: 'input',
    message: messagePadEnd('Version:'),
    suffix: ':',
    validate: noBlank,
    default: "1.0.0"
  };

  var authorQuestion = {
    name: 'author',
    type: 'input',
    message: messagePadEnd('Who will author the code'),
    suffix: ':',
    validate: noBlank,
  };

  var hasParentProjectQuestion = {
    name: 'hasParentProject',
    type: 'confirm',
    message: messagePadEnd('Is this a child-repository?'),
    suffix: ':',
    default: false,
  };

  var parentProjectQuestion = {
    name: 'parentProject',
    type: 'input',
    message: messagePadEnd('Exact name of parent repository'),
    suffix: ':',
    when: (answerHash) => answerHash.hasParentProject,
    validate: noBlank,
  };

  var installInstructionsQuestion = {
    name: 'installInstructions',
    type: 'input',
    message: messagePadEnd('Installation Instructions'),
    suffix: ':',
    validate: noBlank,
  };

  var runRequirementsQuestion = {
    name: 'runRequirements',
    type: 'input',
    message: messagePadEnd('Run Requirements'),
    suffix: ':',
    validate: noBlank,
  };

  var processQuestion = {
    name: 'process',
    type: 'input',
    message: messagePadEnd('Process'),
    suffix: ':',
    validate: noBlank,
  };

  var descriptionQuestion = {
    name: 'description',
    type: 'editor',
    message: messagePadEnd('Project Description (What)'),
    suffix: ':',
    validate: noBlank,
  };

  var purposeQuestion = {
    name: 'purpose',
    type: 'input',
    message: messagePadEnd('Project Purpose (Why)'),
    suffix: ':',
    validate: noBlank,
  };

  var stakeholdersQuestion = {
    name: 'stakeholders',
    type: 'input',
    message: messagePadEnd('Project Stakeholders'),
    suffix: ':',
    validate: noBlank,
  };

  var keywordsQuestion = {
    name: 'keywords',
    type: 'input',
    message: messagePadEnd('List keywords separated by commas'),
    suffix: ':',
    validate: noBlank,
  };

  var sizeValueToPromptAdapter = {
    mini: 'mini   - less than 1 week to complete',
    small: 'small  - less than 1 month to complete',
    medium: 'medium - less than 2 months to complete',
    large: 'large  - 2 months or more to complete',
  };

  var sizePromptToValueAdapter = {
    [sizeValueToPromptAdapter.mini]: 'mini',
    [sizeValueToPromptAdapter.small]: 'small',
    [sizeValueToPromptAdapter.medium]: 'medium',
    [sizeValueToPromptAdapter.large]: 'large',
  };

  var sizeQuestion = {
    name: 'size',
    type: 'list',
    message: messagePadEnd('What is the size of this project?'),
    suffix: ':',
    choices: Object.values(sizeValueToPromptAdapter),
    //Store the size value as a single word (mini, small, medium or large).
    filter: (input) => sizePromptToValueAdapter[input]
  };

  var jsTemplateQuestion = {
    name: 'jsTemplate',
    type: 'list',
    message: messagePadEnd('Choose your JavaScript Templates'),
    suffix: ':',
    choices: ['callback', 'promise', 'sync'],
    when: () => this.options.new
  };

  return [
    titleQuestion,
    repositoryNameQuestion,
    versionQuestion,
    authorQuestion,
    hasParentProjectQuestion,
    parentProjectQuestion,
    installInstructionsQuestion,
    runRequirementsQuestion,
    processQuestion,
    descriptionQuestion,
    purposeQuestion,
    stakeholdersQuestion,
    keywordsQuestion,
    sizeQuestion,
    jsTemplateQuestion
  ];

}
