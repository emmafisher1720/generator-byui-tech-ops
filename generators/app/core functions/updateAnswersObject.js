const baseUrl = 'https://github.com/byuitechops/';
const moment = require('moment');
const url = require('url');

module.exports = function () {
  //Add the following to our answers object
  this.answers.main = this.packageJson.main;
  this.answers.repositoryName = this.packageJson.name;
  this.answers.repositoryLink = new url.URL(this.answers.repositoryName, baseUrl).href;
  this.answers.parentProjectLink = new url.URL(this.answers.parentProject, baseUrl).href;
  this.answers.parentProjectDescription = this.answers.hasParentProject ? `\nThis is part of the [${this.answers.parentProject}](${this.answers.parentProjectLink}) project.\n` : '';
  this.answers.timeCreated = moment().format('YYYY MMMM DD, hh:mm A');
  this.answers.generatorVersion = this.generatorVersion;
  this.answers.keywords = (this.answers.addKeywords) ? this.packageJson.keywords.concat(this.answers.keywords.split(',')) : this.packageJson.keywords;
}
