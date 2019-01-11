const questionTools = require('./questionTools.js');

module.exports = function () {

  // --------------  GENERAL QUESTIONS -----------------
  var readMeQuestion = {
    name: 'appendReadMe',
    type: 'confirm',
    message: questionTools.messagePadEnd('A README.md file exists, would you like to append to the current ReadMe'),
    suffix: ':',
    validate: questionTools.noBlank,
    when: this.readMe !== "",
    default: true
  };

  var projectInfoQuestion = {
    name: 'appendProjectInfo',
    type: 'confirm',
    message: questionTools.messagePadEnd('A PROJECTINFO.md file exists, would you like to append to the current Project File'),
    suffix: ':',
    validate: questionTools.noBlank,
    when: this.projectInfo !== "",
    default: true
  };


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
    message: questionTools.messagePadEnd('Verify Author'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: this.packageJson.author
  };

  /*Why am I asking the description question again when it has been asked by npm init?
    For the same two reasons why I asked for the author again.  (See explanation above.)
  */
  var descriptionQuestion = {
    name: 'description',
    type: 'editor',
    message: questionTools.messagePadEnd('Verify Project Description'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: this.packageJson.description
  };

  var purposeQuestion = {
    name: 'purpose',
    type: 'input',
    message: questionTools.messagePadEnd('Project Purpose (Why)'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: (this.packageJson.byui && this.packageJson.byui.projectPurpose) ? this.packageJson.byui.projectPurpose : ""
  };

  var stakeholdersQuestion = {
    name: 'stakeholders',
    type: 'input',
    message: questionTools.messagePadEnd('Project Stakeholders'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: (this.packageJson.byui && this.packageJson.byui.projectStakeholders) ? this.packageJson.byui.projectStakeholders : ""
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
    message: questionTools.messagePadEnd('What is the size of this project?'),
    suffix: ':',
    choices: Object.values(sizeValueToPromptAdapter),
    default: (this.packageJson.byui && this.packageJson.byui.projectSize) ? sizeValueToPromptAdapter[this.packageJson.byui.projectSize] : sizeValueToPromptAdapter["mini"],
    //Store the size value as a single word (mini, small, medium or large).
    filter: (input) => sizePromptToValueAdapter[input],

  };

  var requirementsQuestion = {
    name: 'requirements',
    type: 'editor',
    message: questionTools.messagePadEnd('Project Reqiurements'),
    suffix: ':',
    validate: questionTools.noBlank,
    default: (this.packageJson.byui && this.packageJson.byui.projectRequirements) ? this.packageJson.byui.projectRequirements : ""
  };

  var installTemplates = {
    standard: 'Standard Install Instructions',
    global: 'Global Install Instructions',
    module: 'Module Install Instructions',
  };

  var installTemplatesToValueAdapter = {
    [installTemplates.standard]: 'StandardInstall-README.md',
    [installTemplates.global]: 'GlobalInstall-README.md',
    [installTemplates.module]: 'ModuleInstall-README.md',
  };

  var readMeTemplateQuestion = {
    name: 'readMeTemplate',
    type: 'list',
    message: questionTools.messagePadEnd('What Install Instructions would you like?'),
    suffix: ':',
    choices: Object.values(installTemplates),
    //Store the size value as a single word (mini, small, medium or large).
    filter: (input) => installTemplatesToValueAdapter[input]
  };

  // ---------------------------------------------------------

  //---------------  PARENT PROJECT QUESTIONS ----------------
  var hasParentProjectQuestion = {
    name: 'hasParentProject',
    type: 'confirm',
    message: questionTools.messagePadEnd('Is this a child-repository?'),
    suffix: ':',
    default: false,
  };

  var parentProjectQuestion = {
    name: 'parentProject',
    type: 'list',
    message: questionTools.messagePadEnd('What is the parent project?'),
    suffix: ':',
    choices: this.parentOptions,
    when: (answerHash) => answerHash.hasParentProject,
    validate: questionTools.noBlank,
  };

  var parentProjectInputQuestion = {
    name: 'parentProject',
    type: 'input',
    message: questionTools.messagePadEnd('Enter EXACT name of parent project (see repo)'),
    suffix: ':',
    when: (answerHash) => answerHash.parentProject == 'other',
    validate: questionTools.noBlank,
  }
  // ---------------------------------------------------------

  //---------------  CODE SETUP QUESTIONS ----------------
  var jsTemplateQuestion = {
    name: 'jsTemplate',
    type: 'list',
    message: questionTools.messagePadEnd('Choose your JavaScript Templates'),
    suffix: ':',
    choices: ['callback', 'promise', 'sync'],
    when: () => this.options.new
  };
  // ---------------------------------------------------------

  //---------------  UNUSED QUESTIONS ----------------
  var howToUseQuestion = {
    name: 'howToUse',
    type: 'input',
    message: questionTools.messagePadEnd('Write everything you would need to know in order to run your tool/module including any commandline arguments, etc. (markdown is supported)'),
    suffix: ':',
    validate: questionTools.noBlank,
  };

  var addAdditionalKeywordsQuestion = {
    name: 'addKeywords',
    type: 'confirm',
    message: questionTools.messagePadEnd(`Add more keywords? (${this.packageJson.keywords ? this.packageJson.keywords.join(',') : ''})`),
    suffix: ':',
    validate: questionTools.noBlank,
    default: false
  }

  var keywordsQuestion = {
    name: 'keywords',
    type: 'input',
    message: questionTools.messagePadEnd('List keywords to add separated by commas'),
    suffix: ':',
    validate: questionTools.noBlank,
    when: (answerHash) => answerHash.addKeywords,
  };
  // ---------------------------------------------------------


  return [

    /* General Questions */
    readMeQuestion,
    projectInfoQuestion,
    authorQuestion,
    descriptionQuestion,
    purposeQuestion,
    stakeholdersQuestion,
    sizeQuestion,
    requirementsQuestion,
    readMeTemplateQuestion,

    /* Parent Project Questions */
    hasParentProjectQuestion,
    parentProjectQuestion,
    parentProjectInputQuestion,

    /*  Code Set-up Questions */
    jsTemplateQuestion,

    /* UNUSED QUESTIONS */
    /* howToUseQuestion, */
    /* addAdditionalKeywordsQuestion, */
    /* keywordsQuestion,  */

  ];

}
