const fs = require('fs');
const path = require('path');

var thisFolderInfo = {
  isGitRepository() {
    return fs.existsSync(path.resolve('./.git')) ? fs.statSync(path.resolve('./.git')).isDirectory() ? true : false : false;
  },

  currentDirName() {
    return path.parse(path.resolve('./')).name;
  },

  hasProjectInfoAlready() {
    return fs.existsSync(path.resolve('./project-info.json'));
  }
};

module.exports = thisFolderInfo;
