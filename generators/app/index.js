'use strict';
const cliPrompts = require('./cliPrompts.js');
const Generator = require('yeoman-generator');
const proc = require('child_process');
const moment = require('moment');

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
    //Create the contents object whose values will be placed in various places in the templates
    this.content = {
      projectTitle: this.answers.title,
      repoName: this._setUpRepo(this.answers.title),
      version: this.answers.version,
      mainJs: /.js/.test(this.answers.mainJs) ? this.answers.mainJs : this.answers.mainJs + ".js", //add the .js extension if it has not been provided.
      author: this.answers.author,
      installInstructions: this.answers.installInstructions,
      runRequirements: this.answers.runRequirements,
      process: this.answers.process,
      parentProjectDescription: this.answers.hasParentProject ? `\nThis is part of the [${this.answers.parentProject}](https://github.com/byuitechops/${this.answers.parentProject}) project.\n` : '',
      projectDescription: this.answers.description,
      projectPurpose: this.answers.purpose,
      projectStakeholders: this.answers.stakeholders,
      keywords: this.answers.keywords.split(','), //Convert the string of keywords to an array
      projectSize: this.answers.size,
      timeCreated: moment().format('YYYY MMMM DD, hh:mm A'),
    };

    //answerHash.repositoryLink = new url.URL(input, baseUrl).href;
    // answerHash.parentProjectLink = new url.URL(input, baseUrl).href;

    //Package.json template
    this.packageJson = {
      name: this.content.repoName,
      version: this.content.version,
      description: this.content.projectDescription,
      main: this.content.mainJs,
      scripts: {},
      repository: {
        type: "git",
        url: `git+https://github.com/byuitechops/${this.content.repoName}`
      },
      keywords: this.content.keywords,
      bugs: {
        url: `https://github.com/byuitechops/${this.content.repoName}/issues`
      },
      homepage: `https://github.com/byuitechops/${this.content.repoName}#readme`,
      dependencies: {},
      author: this.content.author,
      license: "MIT",
      devDependencies: {},
      repository: `byuitechops/${this.content.repoName}`,
      byui: {
        projectPurpose: this.content.projectPurpose,
        projectStakeholders: this.content.projectStakeholders,
        projectSize: this.content.projectSize,
        timeCreated: this.content.timeCreated
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
      this.templatePath('template-PROJECTINFO.md'),
      this.destinationPath(`${this.content.repoName}/PROJECTINFO.md`),
      this.content
    );

    //Write package.json
    this.fs.writeJSON(`${this.content.repoName}/package.json`, this.packageJson);

    //Write main.js file
    this.fs.copyTpl(
      this.templatePath('template-main.js'),
      this.destinationPath(`${this.content.repoName}/${this.content.mainJs}`),
      this.content
    );

    // this.fs.copyTpl(
    //   this.templatePath('template-README.md'),
    //   this.destinationPath(`${this.content.repoName}/README.md`),
    //   this.content
    // );


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
