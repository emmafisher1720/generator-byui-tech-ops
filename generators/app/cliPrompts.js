const thisFolderInfo = require('./thisFolderInfo.js');
const chalk = require('chalk');

function messagePadEnd(string) {
  let padding = 33;
  return string.padEnd(padding);
}

function noBlank(input, answerHash) {
  if (input !== undefined && input.replace(/\s/g, '') !== '') return true;
  else return 'this cannot be left blank!';
}

module.exports = function () {

  // --------------  OVERALL QUESTIONS -----------------

  /*Why am I asking the author question again when it has been asked by npm init?
    Two reasons: 
      1. NPM init does not enforce that this field be filled out, and this does.
      2. For an existing project, npm init will not prompt for the author if a 
         value already exists in the package.json for the author. This gives us the
         opporunity to review who the author is, and decide if a change is needed.
  */
  var authorQuestion = {
    name: 'author',
    type: 'input',
    message: messagePadEnd('Verify Author'),
    suffix: ':',
    validate: noBlank,
    default: this.packageJson.author
  };

  /*Why am I asking the description question again when it has been asked by npm init?
    For the same two reasons why I asked for the author again.  (See explanation above.)
  */
  var descriptionQuestion = {
    name: 'description',
    type: 'editor',
    message: messagePadEnd('Verify Project Description'),
    suffix: ':',
    validate: noBlank,
    default: this.packageJson.description
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

  // ---------------------------------------------------------

  //---------------  PARENT PROJECT QUESTIONS ----------------
  var hasParentProjectQuestion = {
    name: 'hasParentProject',
    type: 'confirm',
    message: messagePadEnd('Is this a child-repository?'),
    suffix: ':',
    default: false,
  };

  var parentProjectQuestion = {
    name: 'parentProject',
    type: 'list',
    message: messagePadEnd('What is the parent project?'),
    suffix: ':',
    choices: this.parentOptions,
    when: (answerHash) => answerHash.hasParentProject,
    validate: noBlank,
  };

  var parentProjectInputQuestion = {
    name: 'parentProject',
    type: 'input',
    message: messagePadEnd('Enter EXACT name of parent project (see repo)'),
    suffix: ':',
    when: (answerHash) => answerHash.parentProject == 'other',
    validate: noBlank,
  }
  // ---------------------------------------------------------

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

  var addAdditionalKeywordsQuestion = {
    name: 'addKeywords',
    type: 'confirm',
    message: messagePadEnd(`Add more keywords? (${this.packageJson.keywords ? this.packageJson.keywords.join(',') : ''})`),
    suffix: ':',
    validate: noBlank,
    default: false
  }

  var keywordsQuestion = {
    name: 'keywords',
    type: 'input',
    message: messagePadEnd('List keywords to add separated by commas'),
    suffix: ':',
    validate: noBlank,
    when: (answerHash) => answerHash.addKeywords,
    //TODO: fix the keywords filter.
    //This filter gives an error.
    // filter: (input) => {
    //   return this.packageJson.keywords.concat(input.split(','));
    // }
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

    /* Overall Questions */
    authorQuestion,
    descriptionQuestion,
    purposeQuestion,
    stakeholdersQuestion,
    sizeQuestion,

    /* Parent Project Questions */
    hasParentProjectQuestion,
    parentProjectQuestion,
    parentProjectInputQuestion,


    installInstructionsQuestion,
    runRequirementsQuestion,
    processQuestion,
    addAdditionalKeywordsQuestion,
    keywordsQuestion,

    /*   Code Set-up Questions */
    jsTemplateQuestion,

  ];

}
