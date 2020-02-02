const path = require('path');

const currentDirectory = require.main.path;
const repoDirectory = path.resolve(currentDirectory, '..');

const fs = require('fs');

const definitionDirectoryPath =
    path.resolve(repoDirectory, 'themes', 'definitions');
const templateDirectoryPath =
    path.resolve(repoDirectory, 'themes', 'templates');

function walkDir(dir) {
    const allPromises = Promise.all(fs.readdirSync(dir)
        .map(file => {
            const dirPath = path.join(dir, file);
            const isDirectory = fs.statSync(dirPath).isDirectory();
            if (isDirectory) {
                return walkDir(dirPath)
            } else {
                return Promise.resolve(path.join(dir, file));
            }
        })).then(scannedDirectories => scannedDirectories
            .reduce((accum, files) => accum.concat(files), []));
    return allPromises;
};

// todo: get templates

function getThemeType(dokiThemeTemplateJson) {
    return dokiThemeTemplateJson.dark ?
        "dark" : "light"
}

function buildLAFColors(dokiThemeTemplateJson) {
    return dokiThemeTemplateJson.colors;
}

function buildSyntaxColors(dokiThemeTemplateJson) {
    return {};
}

function buildVSCodeTheme(
    dokiThemeDefinition,
    dokiTemplateDefinitions
) {
    return {
        type: getThemeType(dokiThemeDefinition),
        colors: buildLAFColors(
            dokiThemeDefinition,
            dokiTemplateDefinitions
        ),
        tokenColors: buildSyntaxColors(
            dokiThemeDefinition,
            dokiTemplateDefinitions
        )
    }
}

function createDokiTheme(
    dokiFileDefinitonPath,
    dokiTemplateDefinitions
) {
    const dokiThemeDefinition = 
        readJson(dokiFileDefinitonPath);
    const dokiTheme = {
        definition: dokiThemeDefinition,
        theme: buildVSCodeTheme(
            dokiThemeDefinition, 
            dokiTemplateDefinitions
        )
    }
    return dokiTheme
}

const readJson = (jsonPath) =>
    JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const readTemplates = templatePaths => {
    return templatePaths
        .map(readJson)
        .reduce((accum, template) => {
            accum[template.name] = template;
            return accum;
        }, {});
};

walkDir(templateDirectoryPath)
    .then(readTemplates)
    .then(dokiTemplateDefinitions => {
        return walkDir(definitionDirectoryPath)
            .then(files => files.filter(file => file.endsWith('doki.json')))
            .then(dokiFileDefinitionPaths => {
                return {
                    dokiTemplateDefinitions,
                    dokiFileDefinitionPaths
                }
            })
    })
    .then(templatesAndDefinitions => {
        const {
            dokiTemplateDefinitions,
            dokiFileDefinitionPaths
        } = templatesAndDefinitions;
        return dokiFileDefinitionPaths.map(
                dokiFileDefinitonPath =>
                    createDokiTheme(
                        dokiFileDefinitonPath,
                        dokiTemplateDefinitions
                    )
            )
    }).then(dokiThemes => {
        // write to package json
        // write things for extension
        // copy to out directory
        console.log(dokiThemes)
    })