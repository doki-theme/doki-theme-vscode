// @ts-ignore
import GroupToNameMapping from "./GroupMappings";

const path = require('path');

const repoDirectory = path.resolve(__dirname, '..');

const fs = require('fs');

const definitionDirectoryPath =
  path.resolve(repoDirectory, 'themes', 'definitions');
const templateDirectoryPath =
  path.resolve(repoDirectory, 'themes', 'templates');

function walkDir(dir: string): Promise<string[]> {
  const values: Promise<string[]>[] = fs.readdirSync(dir)
    .map((file: string) => {
      const dirPath: string = path.join(dir, file);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        return walkDir(dirPath);
      } else {
        return Promise.resolve([path.join(dir, file)]);
      }
    });
  return Promise.all(values)
    .then((scannedDirectories) => scannedDirectories
      .reduce((accum, files) => accum.concat(files), []));
}

const LAF_TYPE = 'laf';
const SYNTAX_TYPE = 'syntax';
const NAMED_COLOR_TYPE = 'colorz';

function getTemplateType(templatePath: string) {
  if (templatePath.endsWith('laf.template.json')) {
    return LAF_TYPE;
  } else if (templatePath.endsWith('syntax.template.json')) {
    return SYNTAX_TYPE;
  } else if (templatePath.endsWith('colors.template.json')) {
    return NAMED_COLOR_TYPE;
  }
  throw new Error(`I do not know what template ${templatePath} is!`);
}

interface EditorScheme {
  type: string;
  name?: string;
  file?: string;
}

export interface StringDictonary<T> {
  [key: string]: T;
}

interface HasColors {
  colors: StringDictonary<string>;
}

interface Overrides {
  editorScheme: HasColors;
}

interface VSCodeDefinitions {
  laf: {
    extends: string;
    ui: StringDictonary<string>
  };
}

interface DokiThemeDefinitions {
  [key: string]: any;
}

interface Stickers {
  default: string;
  secondary?: string;
  normal?: string;
}

interface DokiThemeTemplateDefinition {
  id: string;
  name: string;
  displayName: string;
  dark: boolean;
  author: string;
  group: string;
  editorScheme: EditorScheme;
  stickers: Stickers;
  overrides: Overrides;
  colors: StringDictonary<string>;
  ui: StringDictonary<string>;
  icons: StringDictonary<string>;
  vsCode?: VSCodeDefinitions;

}

function getThemeType(
  dokiThemeTemplateJson: DokiThemeTemplateDefinition
) {
  return dokiThemeTemplateJson.dark ?
    "dark" : "light";
}

function resolveTemplate<T, R>(
  childTemplate: T,
  templateNameToTemplate: StringDictonary<T>,
  attributeResolver: (t: T) => R,
  parentResolver: (t: T) => string,
): R {
  if (!parentResolver(childTemplate)) {
    return attributeResolver(childTemplate);
  } else {
    const parent = templateNameToTemplate[parentResolver(childTemplate)];
    const resolvedParent = resolveTemplate(
      parent,
      templateNameToTemplate,
      attributeResolver,
      parentResolver
    );
    return {
      ...resolvedParent,
      ...attributeResolver(childTemplate)
    };
  }
}

const temp: StringDictonary<string> = {
  COMMENT: '#6272A4',
  ORANGE: '#FFB86C',
  PURPLE: '#BD93F9',
  RED: '#FF5555',
  TEMP_QUOTES: '#e9f284',
  TEMP_PROPERTY_QUOTES: '#8be9fe'
};


function resolveColor(
  color: string,
  namedColors: StringDictonary<string>
) {
  const startingTemplateIndex = color.indexOf('&');
  if (startingTemplateIndex > -1) {
    const lastDelimeterIndex = color.lastIndexOf('&');
    const namedColor =
      color.substring(startingTemplateIndex + 1, lastDelimeterIndex);
    const resolvedNamedColor = namedColors[namedColor] || temp[namedColor];
    if (!resolvedNamedColor) {
      throw new Error(`Cannot find named color '${namedColor}'.`);
    }
    return resolvedNamedColor + color.substring(lastDelimeterIndex + 1) || '';
  }

  return color;
}

function applyNamedColors(
  objectWithNamedColors: StringDictonary<string>,
  namedColors: StringDictonary<string>,
): StringDictonary<string> {
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
      };
    }).reduce((accum: StringDictonary<string>, kv) => {
      accum[kv.key] = kv.value;
      return accum;
    }, {});
}

function buildLAFColors(
  dokiThemeTemplateJson: DokiThemeTemplateDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const lafTemplates = dokiTemplateDefinitions[LAF_TYPE];
  const lafTemplate =
    dokiThemeTemplateJson.vsCode ?
      dokiThemeTemplateJson.vsCode.laf :
      (dokiThemeTemplateJson.dark ?
        lafTemplates.dark : lafTemplates.light);

  const resolvedLafTemplate =
    resolveTemplate(
      lafTemplate, lafTemplates,
      template => template.ui,
      template => template.extends
    );

  const resolvedNameColors = resolveNamedColors(
    dokiTemplateDefinitions,
    dokiThemeTemplateJson
  );

  return applyNamedColors(
    resolvedLafTemplate,
    resolvedNameColors
  );
}

function resolveNamedColors(
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeTemplateJson: DokiThemeTemplateDefinition
) {
  const colorTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  return resolveTemplate(
    dokiThemeTemplateJson,
    colorTemplates,
    template => template.colors,
    // @ts-ignore
    template => template.extends ||
      template.dark !== undefined && (dokiThemeTemplateJson.dark ?
        'dark' : 'light'));
}

function getSyntaxColor(
  syntaxSettingsValue: string,
  resolvedNamedColors: StringDictonary<string>
) {
  if (syntaxSettingsValue.indexOf('&') > -1) {
    return resolveColor(
      syntaxSettingsValue,
      resolvedNamedColors
    );
  } else {
    return syntaxSettingsValue;
  }
}

function buildSyntaxColors(
  dokiThemeTemplateJson: DokiThemeTemplateDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const syntaxTemplate: any[] = dokiTemplateDefinitions[SYNTAX_TYPE].base.tokenColors;
  const resolvedNamedColors = resolveNamedColors(
    dokiTemplateDefinitions, dokiThemeTemplateJson
  );
  return syntaxTemplate.map(tokenSpecification => {
    const newTokenSpec = {
      ...tokenSpecification
    };

    const newsettings = Object.keys(newTokenSpec.settings)
      .map(key => {
        const oldValue = newTokenSpec.settings[key];
        const value = getSyntaxColor(
          oldValue,
          resolvedNamedColors
        );
        return {key, value};
      }).reduce((accum: StringDictonary<string>, next) => {
        accum[next.key] = next.value;
        return accum;
      }, {});
    newTokenSpec.settings =
      newsettings;

    return {
      ...tokenSpecification,
      settings: newsettings
    };
  });
}

function buildVSCodeTheme(
  dokiThemeDefinition: DokiThemeTemplateDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions
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
  };
}

function createDokiTheme(
  dokiFileDefinitonPath: string,
  dokiTemplateDefinitions: DokiThemeDefinitions
) {
  const dokiThemeDefinition =
    readJson(dokiFileDefinitonPath);
  try {
    return {
      path: dokiFileDefinitonPath,
      definition: dokiThemeDefinition,
      theme: buildVSCodeTheme(
        dokiThemeDefinition,
        dokiTemplateDefinitions
      )
    };
  } catch (e) {
    throw new Error(`Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`);
  }
}

const readJson = (jsonPath: string) =>
  JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

type TemplateTypes = StringDictonary<StringDictonary<string>>;

const readTemplates = (templatePaths: string[]): TemplateTypes => {
  return templatePaths
    .map(templatePath => {
      return {
        type: getTemplateType(templatePath),
        template: readJson(templatePath)
      };
    })
    .reduce((accum: TemplateTypes, templateRepresentation) => {
      accum[templateRepresentation.type][templateRepresentation.template.name] =
        templateRepresentation.template;
      return accum;
    }, {
      [SYNTAX_TYPE]: {},
      [LAF_TYPE]: {},
      [NAMED_COLOR_TYPE]: {},
    });
};

const base64Img = require('base64-img');

function readSticker(
  themeDefinitonPath: string,
  themeDefinition: DokiThemeTemplateDefinition,
) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitonPath, '..'),
    themeDefinition.stickers.normal || themeDefinition.stickers.default
  );
  return base64Img.base64Sync(stickerPath);
}

function getThemeGroup(dokiDefinition: DokiThemeTemplateDefinition) {
  const themeGroup = dokiDefinition.group;
  const groupMapping = GroupToNameMapping[themeGroup];

  if (!groupMapping) {
    throw new Error(`Unable to find group mapping
        ${themeGroup} for theme ${dokiDefinition.name}`);
  }

  return groupMapping;
}

const omit = require('lodash/omit');

console.log('Preparing to generate themes.');
walkDir(templateDirectoryPath)
  .then(readTemplates)
  .then(dokiTemplateDefinitions => {
    return walkDir(definitionDirectoryPath)
      .then(files => files.filter(file => file.endsWith('doki.json')))
      .then(dokiFileDefinitionPaths => {
        return {
          dokiTemplateDefinitions,
          dokiFileDefinitionPaths
        };
      });
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
    );
  }).then(dokiThemes => {
  // write things for extension
  const dokiThemeDefinitions = dokiThemes.map(dokiTheme => {
    const dokiDefinition = dokiTheme.definition;
    return {
      extensionName: getCommandName(dokiDefinition),
      themeDefinition: {
        information: omit(dokiDefinition, [
          'colors',
          'overrides',
          'ui',
          'icons'
        ]),
        sticker: readSticker(
          dokiTheme.path,
          dokiDefinition
        ),
      }
    };
  });
  const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
  fs.writeFileSync(
    path.resolve(repoDirectory, 'src', 'DokiThemeDefinitions.ts'),
    `export default ${finalDokiDefinitions};`);

  // copy to out directory
  const themeOutputDirectory = 'generatedThemes';
  const themePostfix = '.theme.json';
  dokiThemes.forEach(dokiTheme => {
    const vsCodeTheme = dokiTheme.theme;
    fs.writeFileSync(
      path.resolve(repoDirectory,
        themeOutputDirectory,
        `${dokiTheme.definition.name}${themePostfix}`),
      JSON.stringify(vsCodeTheme, null, 2)
    );
  });


  // write to package json
  const dokiDefinitions = dokiThemes.map(d => d.definition);
  const packageJsonPath =
    path.resolve(repoDirectory, 'package.json');
  const packageJson = readJson(packageJsonPath);
  const activationEvents =
    dokiDefinitions.map(dokiDefinition =>
      `onCommand:${getCommandName(dokiDefinition)}`
    );

  const commands = dokiDefinitions.map(dokiDefinition => ({
    command: getCommandName(dokiDefinition),
    title: `Doki-Theme: Install ${dokiDefinition.name}'s Stickers`
  }));

  const themes = dokiDefinitions.map(dokiDefinition => ({
    id: dokiDefinition.id,
    label: `Doki Theme: ${getThemeGroup(dokiDefinition)} ${dokiDefinition.displayName}`,
    path: `./${themeOutputDirectory}/${dokiDefinition.name}${themePostfix}`,
    uiTheme: dokiDefinition.dark ? 'vs-dark' : 'vs'
  }));

  packageJson.activationEvents = [
    ...packageJson.activationEvents.filter((activationEvent: string) =>
      !activationEvent.startsWith("onCommand:extension.theme")),
    ...activationEvents
  ];

  packageJson.contributes.commands =
    [
      ...packageJson.contributes.commands.filter((command: { command: string }) =>
        !command.command.startsWith('extension.theme')),
      ...commands
    ];
  packageJson.contributes.themes = themes;
  return new Promise((resolve, reject) => fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  ));
})
  .then(() => {
    // UPDATE CHANGELOG
    const showdown = require('showdown');
    const markdownConverter = new showdown.Converter();

    const changelogPath = path.join(
      repoDirectory, 'CHANGELOG.md'
    );
    const changelogText = fs.readFileSync(
      changelogPath, 'utf-8'
    );

    const changelogHTML = markdownConverter.makeHtml(
      changelogText
    );

    fs.writeFileSync(
      path.resolve(repoDirectory, 'src', 'ChangelogHtml.ts'),
      `export default \`${changelogHTML}\`;`);
  })
  .then(() => {
    console.log('Theme Generation Complete!');
  });

function getCommandName(dokiDefinition: DokiThemeTemplateDefinition) {
  return `extension.theme.${dokiDefinition.name}`;
}
