const path = require('path');

const currentDirectory = require.main.path;
const repoDirectory = path.resolve(currentDirectory, '..');



console.log(repoDirectory);