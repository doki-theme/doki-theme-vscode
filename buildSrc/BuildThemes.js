const path = require('path');

const currentDirectory = require.main.path;
const repoDirectory = path.resolve(currentDirectory, '..');

const fs = require('fs');

const definitionDirectoryPath =
    path.resolve(repoDirectory, 'themes', 'definitions');
const templateDirectoryPath =
    path.resolve(repoDirectory, 'themes', 'templates');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ?
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
};

// todo: get templates

function getThemeType(dokiThemeTemplateJson) {
    return dokiThemeTemplateJson.dark ? 
    "dark": "light"
}

function buildLAFColors(dokiThemeTemplateJson) {
    return dokiThemeTemplateJson.colors;
}

function buildSyntaxColors(dokiThemeTemplateJson) {
    return {};
}

walkDir(definitionDirectoryPath, (filePath) => {
    if (filePath.endsWith('doki.json')) {
        const dokiThemeTemplateJson =
            JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const vsCodeTheme = {
            type: getThemeType(dokiThemeTemplateJson),
            colors: buildLAFColors(dokiThemeTemplateJson),
            tokenColors: buildSyntaxColors(dokiThemeTemplateJson),
        }
        console.log(vsCodeTheme);
    }
})