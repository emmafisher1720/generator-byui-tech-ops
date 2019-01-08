'use strict';
const Generator = require('yeoman-generator');
const proc = require('child_process');
const chalk = require('chalk');
const parentOptions = require('./templates/parentprojects.js');
const generatorPackageJson = require('../../package.json');

module.exports = class ByuiTechOpsGenerator extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.option('new');
    this.parentOptions = parentOptions;
    //Make the _cliPrompts method a class method. (This allows us to have class access from within cliPrompts)
    this._cliPrompts = require('./cliPrompts.js');
    this._updatePackageJsonObject = require('./updatePackageJsonObject.js');
    this._updateAnswersObject = require('./updateAnswersObject.js');
    this._readInFile = require('./readInFile.js');
    this._runNpmInit = require('./runNpmInit.js');
    //This sets the destination root folder, so that no matter what the contents will be placed in the folder from which the yo byui-tech-ops
    //command was called.
    this.destinationRoot(this.contextRoot);
    this.generatorVersion = generatorPackageJson.version;

  }

  _setUpDestinationFolder(filename) {
    return (this.options.new) ? `${this.answers.repositoryName}/${filename}` : filename;
  }

  async initializing() {

    var that = this;
    try {
      var code = 1;
      do {
        this.log(chalk.yellowBright("---------- Running NPM INIT -----------"));
        code = await this._runNpmInit();
      } while (code === 1);
    } catch (e) {
      //If we are here, there was an error running NPM Init
      this.log(chalk.red("ERROR: " + e.message));
    }

    //Read in package.json
    this._readInFile("packageJson", "package.json");

    //Read in README.md if one exists
    if (this.fs.exists('README.md')) {
      this._readInFile("readMe", "README.md");
    } else {
      this.readMe = "";
    }

    //Read in PROJECTINFO.md if one exists
    if (this.fs.exists('PROJECTINFO.md')) {
      this._readInFile("projectInfo", "PROJECTINFO.md");
    } else {
      this.projectInfo = "";
    }
  }

  prompting() {
    //Let the user know we are starting
    this.log(chalk.yellowBright("--------- Begin Custom Questionaire ---------"));
    return this.prompt(this._cliPrompts())
      .then(answers => {
        this.answers = answers;
      });
  }

  configuring() {
    //Update the answers object
    this._updateAnswersObject();

    //Update the package.json object
    this._updatePackageJsonObject();

  }

  writing() {

    //Create a new directory if the --new flag is found
    if (this.options.new) {
      proc.exec(`mkdir ${this.answers.repositoryName}`);
    }

    //Write PROJECTINFO.md
    this.fs.copyTpl(
      this.templatePath('PROJECTINFO.md'),
      this.destinationPath(this._setUpDestinationFolder('PROJECTINFO.md')),
      this.answers
    );

    //TODO: if a readme exists, leave it, and don't create an new one.
    //Write package.json
    //TODO: We need to rewrite the package.json after we have updated it.
    this.fs.writeJSON(this._setUpDestinationFolder('package.json'), this.packageJson);



    //Probably will break this out so that we aren't doing so much work when a readme doesn't exist.
    if (this.readMe === "" || this.answers.appendReadMe === true) {
      //Write new README.md file
      this.fs.copyTpl(
        this.templatePath('README.md'),
        this.destinationPath(this._setUpDestinationFolder('README.md')),
        this.answers
      );

      //Have not tested this!
      this.newReadMe = this.fs.read(this._setUpDestinationFolder('README.md'));
      this.readMe = this.readMe + this.newReadMe;
      this.fs.write(this._setUpDestinationFolder('README.md'), this.readMe);

      //This doesn't currently delete the temp folder.
      // proc.spawnSync(`rm ${this._setUpDestinationFolder('temp_README.md')}`);

    }

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
    //Handle conflicts auto do this
    // var conflict = new Conflicter(ByuiTechOpsGenerator, false);
  }

  install() {
    // this.installDependencies();
  }

  end() {
    //this.log("in end method");
    //proc.exec(`cd ${this.repositoryName}`)
  }

};
