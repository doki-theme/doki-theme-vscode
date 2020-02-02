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

function resolveTemplate(
    childTemplate,
    templateNameToTemplate,
    attributeResolver
) {
    if (!childTemplate.extends) {
        return attributeResolver(childTemplate)
    } else {
        const parent = templateNameToTemplate[childTemplate.extends];
        const resolvedParent = resolveTemplate(
            parent,
            templateNameToTemplate,
            attributeResolver
        );
        return {
            ...resolvedParent,
            ...attributeResolver(childTemplate)
        };
    }
}


function resolveColor(
    color,
    namedColors
) {
    const startingTemplateIndex = color.indexOf('&');
    if (startingTemplateIndex > -1) {
        const namedColor =
            color.substring(startingTemplateIndex + 1, color.lastIndexOf('&'))
        const resolvedNamedColor = namedColors[namedColor]
        if (!resolvedNamedColor) {
            throw new Error(`Cannot find named color '${namedColor}'.`)
        }
        return resolvedNamedColor;
    }

    return color
}

function applyNamedColors(
    objectWithNamedColors,
    namedColors
) {
    return Object.keys(objectWithNamedColors)
        .map(key => {
            const color = objectWithNamedColors[key];
            const resolvedColor = resolveColor(
                color,
                namedColors
            );
            return {
                key,
                value: resolvedColor
            }
        }).reduce((accum, kv) => {
            accum[kv.key] = kv.value;
            return accum;
        }, {});
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
            lafTemplate, lafTemplates, template => template.ui
        );
    return applyNamedColors(
        resolvedLafTemplate,
        dokiThemeTemplateJson.colors
    );
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
    try {
        const dokiTheme = {
            path: dokiFileDefinitonPath,
            definition: dokiThemeDefinition,
            theme: buildVSCodeTheme(
                dokiThemeDefinition,
                dokiTemplateDefinitions
            )
        }
        return dokiTheme;
    } catch (e) {
        throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`)
    }
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

const base64Img = require('base64-img');

function readSticker(
    themeDefinitonPath,
    themeDefinition,
) {
    const stickerPath = path.resolve(
        path.resolve(themeDefinitonPath, '..'),
        themeDefinition.stickers.default
    );
    return base64Img.base64Sync(stickerPath);
}

const omit = require('lodash/omit');

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
        const dokiDefinitions = dokiThemes.map(d => d.definition);

        // write to package json
        const packageJsonPath =
            path.resolve(repoDirectory, 'package.json');
        const packageJson = readJson(packageJsonPath);
        const activationEvents =
            dokiDefinitions.map(dokiDefinition =>
                `onCommand:extension.${dokiDefinition.name}`
            )

        const commands = dokiDefinitions.map(dokiDefinition => ({
            command: getCommandName(dokiDefinition),
            title: `Activate Doki Theme: ${dokiDefinition.displayName}`
        }))

        const themes = dokiDefinitions.map(dokiDefinition => ({
            id: dokiDefinition.id,
            label: `Doki Theme: ${dokiDefinition.displayName}`,
            path: `./out/themes/${dokiDefinition.name}.theme.json`,
            uiTheme: dokiDefinition.dark ? 'vs-dark' : 'vs'
        }))

        packageJson.activationEvents = activationEvents
        packageJson.contributes.commands = commands;
        packageJson.contributes.themes = themes;
        fs.writeFileSync(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2)
        )

        // write things for extension
        // stickers, extension registry
        const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
            const dokiDefinition = dokiTheme.definition
            return {
                extensionName: getCommandName(dokiDefinition),
                themeDefinition: {
                    information: omit(dokiDefinition,[
                        'colors',
                        'overrides',
                        'ui',
                        'icons'
                    ] ),
                    sticker: readSticker(
                        dokiTheme.path,
                        dokiDefinition
                    ),
                }
            }
        });
        const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
        fs.writeFileSync(
            path.resolve(repoDirectory, 'src', 'DokiThemeDefinitions.ts'), 
        `export default ${finalDokiDefinitions};`)


        // copy to out directory
        const vsCodeThemes = dokiThemes.map(d => d.theme);
    })

function getCommandName(dokiDefinition) {
    return `extension.${dokiDefinition.name}`;
}
