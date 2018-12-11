'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');
const url = require('url');
const chalk = require('chalk');
const baseUrl = 'https://github.com/byuitechops/';
const makePackageJson = require('./makePackageJson.js');
//Not to be confused with this.fs
const fs = require('fs');
module.exports = class ByuiTechOpsGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.option('new');
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
    return (this.options.new) ? `${this.answers.repositoryName}/${filename}` : filename;
  }

  _runNpmInit(thisContext) {
    return new Promise(function (success, fail) {
      thisContext.log(chalk.yellowBright("---------- Running NPM INIT -----------"));
      var npmInit = proc.spawn('npm init', {
        stdio: ['inherit', null, 'inherit'],
        shell: true
      });

      npmInit.stdout.on('data', function (data) {
        process.stdout.write(data.toString());
      });

      npmInit.on('exit', function (code, signal) {
        if (code === 0) {
          success('');
        } else if (code === 1) {
          //If the user says 'no' to the generated package.json file
          thisContext.log(chalk.yellowBright("Since you didn't like that package.json, let's try again!\n"));
          thisContext._runNpmInit(thisContext);
        }

      });

    });
  }

  initializing() {
    // fs.readdir('./', function (err, files) {
    //   var expectedFiles = ['package.json', 'README.md', 'PROJECTINFO.md'];
    //   //Check for README

    // });

    //TODO: show defaults when they exist

    return this._runNpmInit(this);
  }

  prompting() {
    //Make the _cliPrompts method a class method. (This allows us to have class access from within cliPrompts)
    this._cliPrompts = cliPrompts;
    return this.prompt(this._cliPrompts())
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
      this.destinationPath(this._setUpDestinationFolder('PROJECTINFO.md')),
      this.answers
    );

    //TODO: if a readme exists, leave it, and don't create an new one.
    //Write package.json
    this.fs.writeJSON(this._setUpDestinationFolder('package.json'), this.packageJson);

    //Write README.md file
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath(this._setUpDestinationFolder('README.md')),
      this.answers
    );

    //Only generate the following boilerplate code for new projects
    if (this.options.new) {
      //Write main.js file
      this.fs.copyTpl(
        this.templatePath(`jsTemplates/${this.answers.jsTemplate}/main.js`),
        this.destinationPath(this._setUpDestinationFolder('main.js')),
        this.answers
      );

      //Write bin.js file
      this.fs.copyTpl(
        this.templatePath(`jsTemplates/${this.answers.jsTemplate}/bin.js`),
        this.destinationPath(this._setUpDestinationFolder('bin.js')),
        this.answers
      );

      //Write test.js file
      this.fs.copyTpl(
        this.templatePath(`jsTemplates/${this.answers.jsTemplate}/test.js`),
        this.destinationPath(this._setUpDestinationFolder('test.js')),
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
