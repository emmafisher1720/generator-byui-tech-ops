'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  _setUpRepo(projectTitle) {

    //Get rid of space at the beginning and end
    var repoName = projectTitle.replace(/^\s+/g, '').replace(/\s+$/g, '');
    //Replace spaces inbetween words with '-'
    repoName = repoName.toLowerCase().replace(/\s+/g, '-');

    //Create the folder that will hold all the files
    proc.exec(`mkdir ${repoName}`);
    return repoName;
  }

  _formatKeyWords(keywordString) {
    var keywordsArray = keywordString.split(',');
    // this.log(keywordString);
    // this.log(keywordsArray);
    var str = JSON.stringify(keywordsArray);
    this.log(str);
    return str;
    // keywordsArray = keywordsArray.map(word => {
    //   return '"' + word + '"';
    // });
    // this.log(keywordsArray);
    // return keywordsArray.join(',\n');
  }

  initializing() {

  }

  prompting() {
    return this.prompt(cliPrompts)
      .then(answers => {
        // To access props later use this.props.someAnswer;
        this.answers = answers;

        //Make a variable that has a brief description indicating what the parent project is.
        this.parentProjectDescription =
          `\nThis is part of the [${this.answers.parentProject}](https://github.com/byuitechops/${this.answers.parentProject}) project.\n`;
      })
      .then(() => this.repoName = this._setUpRepo(this.answers.title))
      .then(() => this._formatKeyWords(this.answers.keywords));
  }



  writing() {
    this.content = {
      projectTitle: this.answers.title,
      repoName: this.repoName,
      author: this.answers.author,
      parentProjectDescription: this.answers.hasParentProject ? this.parentProjectDescription : '',
      projectDescription: this.answers.description,
      projectPurpose: this.answers.purpose,
      projectStakeholders: this.answers.stakeholders,
      keywords: this._formatKeyWords(this.answers.keywords),
      projectSize: this.answers.size,
      timeCreated: moment().format('YYYY MMMM DD, hh:mm A'),
    };
    this.fs.copyTpl(
      this.templatePath('template-PROJECTINFO.md'),
      this.destinationPath(`${this.repoName}/PROJECTINFO.md`),
      this.content
    );

    this.fs.copyTpl(
      this.templatePath('template-package.json'),
      this.destinationPath(`${this.repoName}/package.json`),
      this.content
    );



  }

  // install() {
  //   this.installDependencies();
  // }


  end() {
    //this.log("in end method");
    //proc.exec(`cd ${this.repoName}`)



  }

};
