module.exports = function () {
  //Overwrite these existing values in the package.json object
  //Do this so that if a different description, author, or etc. is given, we overwrite with the value that the user has selected during the inquirer prompt.
  this.packageJson.description = this.answers.description;
  this.packageJson.author = this.answers.author;
  this.packageJson.keywords = this.answers.keywords;

  //Add the byui key

  this.packageJson.byui = Object.assign((this.packageJson.byui) ? this.packageJson.byui : {}, {
    documentGeneratorVersion: this.answers.generatorVersion,
    projectPurpose: this.answers.purpose,
    projectStakeholders: this.answers.stakeholders,
    projectSize: this.answers.size,
    timeCreated: this.answers.timeCreated
  });
}
