module.exports = makePackageJson(answers) {
    return {
      name: answers.repositoryName,
      version: answers.version,
      description: answers.description,
      main: answers.main,
      repository: {
        type: "git",
        url: answers.repositoryLink
      },
      keywords: answers.keywords, //package json default
      bugs: {
        url: `${answers.repositoryLink}/issues`
      },
      author: answers.author,
      license: "MIT", //answers.license, //package json default
      repository: `byuitechops/${answers.repositoryName}`,
      byui: {
        documentGeneratorVersion: answer.generatorVersion, //Need to add this document generator version.
        projectPurpose: answers.purpose,
        projectStakeholders: answers.stakeholders,
        projectSize: answers.size,
        timeCreated: answers.timeCreated
      }
    };
  }