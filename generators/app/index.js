'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');
const fs = require('fs');

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

  async prompting() {
    
    // Read in the package.json file
    var options = {
      windowsHide: false,
      stdio: [this.log, this.log, this.log]

    };
    try {
      proc.execSync(`npm init`, options);
    } catch (e) {
      this.log(e);
    }
      
      
      /* , (error, stdout, stderr) => {
      if (error) {
        this.log(`exec error: ${error}`);
        return;
      }
      this.log("stdout: " + stdout);
      this.log("error: " + error);

    }); */

    // proc.execSync('npm init');
    //var packageJson = fs.readFileSync('./package.json').toString();


    //Prompt for byui 
    return this.prompt(cliPrompts)
      .then(byuiAnswers => {
        // To access props later use this.props.someAnswer;
        this.byuiAnswers = byuiAnswers;

        //2nd overwrites the first

        //Make a variable that has a brief description indicating what the parent project is.
        this.parentProjectDescription =
          `\nThis is part of the [${this.byuiAnswers.parentProject}](https://github.com/byuitechops/${this.byuiAnswers.parentProject}) project.\n`;
      })
      .then(() => this.repoName = this._setUpRepo(this.byuiAnswers.title))
      .then(() => this._formatKeyWords(this.byuiAnswers.keywords));
  }



  writing() {
    this.content = {
      projectTitle: this.byuiAnswers.title,
      repoName: this.repoName,
      author: this.byuiAnswers.author,
      parentProjectDescription: this.byuiAnswers.hasParentProject ? this.parentProjectDescription : '',
      projectDescription: this.byuiAnswers.description,
      projectPurpose: this.byuiAnswers.purpose,
      projectStakeholders: this.byuiAnswers.stakeholders,
      keywords: this._formatKeyWords(this.byuiAnswers.keywords),
      projectSize: this.byuiAnswers.size,
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
