'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');
const url = require('url');
const baseUrl = 'https://github.com/byuitechops/';
const makePackageJson = require('./makePackageJson.js');
//Not to be confused with this.fs
const fs = require('fs');
module.exports = class ByuiTechOpsGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  //Only gets called if this is a new project
  _setUpRepo(projectTitle) {

    //Get rid of space at the beginning and end
    var repositoryName = projectTitle.replace(/^\s+/g, '').replace(/\s+$/g, '');
    //Replace spaces inbetween words with '-'
    repositoryName = repositoryName.toLowerCase().replace(/\s+/g, '-');

    //Create the folder that will hold all the files
    proc.exec(`mkdir ${repositoryName}`);
    return repositoryName;
  }

  //
  _setUpDestinationFolder(filename) {
    return (this.answers.isNew) ? `${this.answers.repositoryName}/${filename}` : filename;
  }

  initializing() {
    //TODO: Make decisions based on whether this is new or existing. fs.readDir
    //TODO: Read in Package.json if exists. this.packageJson
    //if the package Json doesn't exist, create an empty packageJson object

    fs.readdir('./', function (err, files) {
      var expectedFiles = ['package.json', 'README.md', 'PROJECTINFO.md'];
      //Check for README

      //Check for Package.Json

    });

    //TODO: show defaults when they exist
  }

  prompting() {
    return this.prompt(cliPrompts(this.packageJson))
      .then(answers => {
        this.answers = answers;
      });
  }

  configuring() {
    //Add the following to our answers object
    //Need to test this line
    this.answers.repositoryName = (this.answers.repositoryName) ? this.answers.repositoryName : this._setUpRepo(this.answers.title);
    this.answers.repositoryLink = new url.URL(this.answers.repositoryName, baseUrl).href;
    this.answers.parentProjectLink = new url.URL(this.answers.parentProject, baseUrl).href;
    this.answers.parentProjectDescription = this.answers.hasParentProject ? `\nThis is part of the [${this.answers.parentProject}](${this.answers.parentProjectLink}) project.\n` : '';
    this.answers.timeCreated = moment().format('YYYY MMMM DD, hh:mm A');
    this.answers.keywords = this.answers.keywords.split(',');

    //TODO: Remove github links?  if you run npm init, then the 
    //TODO: maybe look into NPM init somemore
    this.packageJson = makePackageJson(this.answers);
  }

  //Default (other methods are run here)

  writing() {
    //This sets the destination root folder, so that no matter what the contents will be placed in the folder from which the yo byui-tech-ops
    //command was called.
    this.destinationRoot(this.contextRoot);

    //Write PROJECTINFO.md
    this.fs.copyTpl(
      this.templatePath('PROJECTINFO.md'),
      this.destinationPath(_setUpDestinationFolder('PROJECTINFO.md')),
      this.answers
    );

    //TODO: if a readme exists, leave it, and don't create an new one.
    //Write package.json
    this.fs.writeJSON(_setUpDestinationFolder('package.json'), this.packageJson);

    //Write README.md file
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(_setUpDestinationFolder('README.md')),
      this.answers
    );

    //Only generate the following boilerplate code for new projects
    if (this.answers.isNew) {
      //Write main.js file
      this.fs.copyTpl(
        this.templatePath('main.js'),
        this.destinationPath(_setUpDestinationFolder('main.js')),
        this.answers
      );

      //Write bin.js file
      this.fs.copyTpl(
        this.templatePath('bin.js'),
        this.destinationPath(_setUpDestinationFolder('bin.js')),
        this.answers
      );

      //Write test.js file
      this.fs.copyTpl(
        this.templatePath('test.js'),
        this.destinationPath(_setUpDestinationFolder('test.js')),
        this.answers
      );
    }

  }

  conflicts() {
    //Handle conflicts
  }

  install() {
    // this.installDependencies();
  }

  end() {
    //this.log("in end method");
    //proc.exec(`cd ${this.repositoryName}`)
  }

};
