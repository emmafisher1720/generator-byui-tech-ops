'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');
const url = require('url');
const baseUrl = 'https://github.com/byuitechops/';
module.exports = class ByuiTechOpsGenerator extends Generator {

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

  initializing() {

  }

  prompting() {
    return this.prompt(cliPrompts)
      .then(answers => {
        // To access props later use this.props.someAnswer;
        this.answers = answers;
      });
  }

  configuring() {
    //Add the following to our answers object
    this.answers.repoName = this._setUpRepo(this.answers.title);
    this.answers.repositoryLink = new url.URL(this.answers.repoName, baseUrl).href;
    this.answers.parentProjectLink = new url.URL(this.answers.parentProject, baseUrl).href;
    this.answers.parentProjectDescription = this.answers.hasParentProject ? `\nThis is part of the [${this.answers.parentProject}](${this.answers.parentProjectLink}) project.\n` : '';
    this.answers.timeCreated = moment().format('YYYY MMMM DD, hh:mm A');
    this.answers.keywords = this.answers.keywords.split(',');

    //Package.json template
    this.packageJson = {
      name: this.answers.repoName,
      version: this.answers.version,
      description: this.answers.description,
      main: this.answers.entryPoint,
      scripts: {},
      repository: {
        type: "git",
        url: this.answers.repositoryLink
      },
      keywords: this.answers.keywords,
      bugs: {
        url: `${this.answers.repositoryLink}/issues`
      },
      homepage: `${this.answers.repositoryLink}#readme`,
      dependencies: {},
      author: this.answers.author,
      license: "MIT",
      devDependencies: {},
      repository: `byuitechops/${this.answers.repoName}`,
      byui: {
        projectPurpose: this.answers.purpose,
        projectStakeholders: this.answers.stakeholders,
        projectSize: this.answers.size,
        timeCreated: this.answers.timeCreated
      }
    }
  }

  //Default (other methods are run here)

  writing() {
    //This note from: https://yeoman.io/authoring/file-system.html
    //"The destination context is defined as either the current working directory or the closest parent folder containing a .yo-rc.json file."

    //This sets the destination root folder, so that no matter what the contents will be placed in the folder from which the yo byui-tech-ops
    //command was called.
    this.destinationRoot(this.contextRoot);

    //Write PROJECTINFO.md
    this.fs.copyTpl(
      this.templatePath('PROJECTINFO.md'),
      this.destinationPath(`${this.answers.repoName}/PROJECTINFO.md`),
      this.answers
    );

    //Write package.json
    this.fs.writeJSON(`${this.answers.repoName}/package.json`, this.packageJson);

    //Write main.js file
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath(`${this.answers.repoName}/${this.answers.entryPoint}`),
      this.answers
    );

    //Write entry.js file
    this.fs.copyTpl(
      this.templatePath('entry.js'),
      this.destinationPath(`${this.answers.repoName}/entry.js`),
      this.answers
    );

    //Write entry.js file
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath(`${this.answers.repoName}/test.js`),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(`${this.answers.repoName}/README.md`),
      this.answers
    );


  }

  conflicts() {
    //Handle conflicts
  }

  // install() {
  //   this.installDependencies();
  // }

  end() {
    //this.log("in end method");
    //proc.exec(`cd ${this.repoName}`)
  }

};
