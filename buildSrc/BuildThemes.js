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
const LAF_TYPE = 'laf';
const SYNTAX_TYPE = 'syntax';

function getTemplateType(templatePath) {
    if (templatePath.endsWith('laf.template.json')) {
        return LAF_TYPE;
    } else if (templatePath.endsWith('syntax.template.json')) {
        return SYNTAX_TYPE
    }
    throw new Error(`I do not know what template ${templatePath} is!`);
}


function getThemeType(dokiThemeTemplateJson) {
    return dokiThemeTemplateJson.dark ?
        "dark" : "light"
}

// todo fill this out
function resolveTemplate(
    childTemplate,
    templateNameToTemplate
) {
    return childTemplate;
}

function buildLAFColors(
    dokiThemeTemplateJson,
    dokiTemplateDefinitions
) {
    const lafTemplates = dokiTemplateDefinitions[LAF_TYPE];
    const lafTemplate = dokiThemeTemplateJson.dark ?
    lafTemplates.dark : lafTemplates.base;


    const resolvedLafTemplate = 
        resolveTemplate(
            lafTemplate, lafTemplates
        );

    console.log(resolvedLafTemplate);

    return dokiThemeTemplateJson.colors;
}

function buildSyntaxColors(
    dokiThemeTemplateJson,
    dokiTemplateDefinitions
) {
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
        .map(templatePath => {
            return {
                type: getTemplateType(templatePath),
                template: readJson(templatePath)
            }
        })
        .reduce((accum, templateRepresentation) => {
            accum[templateRepresentation.type][templateRepresentation.template.name] =
                templateRepresentation.template;
            return accum;
        }, {
            [SYNTAX_TYPE]: {},
            [LAF_TYPE]: {},
        });
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
        // console.log(dokiThemes)
    })