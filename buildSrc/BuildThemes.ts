// @ts-ignore
import GroupToNameMapping from "./GroupMappings";
import keys from "lodash/keys";

const path = require("path");

const repoDirectory = path.resolve(__dirname, "..");

const fs = require("fs");

const masterThemeDefinitionDirectoryPath = path.resolve(
  repoDirectory,
  "masterThemes",
  "definitions"
);
const vsCodeDefinitionDirectoryPath = path.resolve(
  repoDirectory,
  "themes",
  "definitions"
);

const masterThemeTemplateDirectoryPath = path.resolve(
  masterThemeDefinitionDirectoryPath,
  "..",
  "templates"
);

const vsCodeTemplateDirectoryPath = path.resolve(
  repoDirectory,
  "themes",
  "templates"
);

const swapMasterThemeForLocalTheme = (
  masterDokiThemeDefinitionPath: string
): string => {
  const masterThemeFilePath = masterDokiThemeDefinitionPath.substring(
    masterThemeDefinitionDirectoryPath.toString().length
  );
  return `${vsCodeDefinitionDirectoryPath}${masterThemeFilePath}`;
};

function walkDir(dir: string): Promise<string[]> {
  const values: Promise<string[]>[] = fs
    .readdirSync(dir)
    .map((file: string) => {
      const dirPath: string = path.join(dir, file);
      const isDirectory = fs.statSync(dirPath).isDirectory();
      if (isDirectory) {
        return walkDir(dirPath);
      } else {
        return Promise.resolve([path.join(dir, file)]);
      }
    });
  return Promise.all(values).then((scannedDirectories) =>
    scannedDirectories.reduce((accum, files) => accum.concat(files), [])
  );
}

const LAF_TYPE = "laf";
const SYNTAX_TYPE = "syntax";
const NAMED_COLOR_TYPE = "colorz";

function getTemplateType(templatePath: string) {
  if (templatePath.endsWith("laf.template.json")) {
    return LAF_TYPE;
  } else if (templatePath.endsWith("syntax.template.json")) {
    return SYNTAX_TYPE;
  } else if (templatePath.endsWith("colors.template.json")) {
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
  laf?: {
    extends: string;
    ui: StringDictonary<string>;
  };
  overrides?: {
    editorScheme?: {
      colors: StringDictonary<string>;
    };
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

interface BackgroundPositioning {
  anchor: string;
}

interface BackgroundPositionings {
  default?: BackgroundPositioning;
  secondary?: BackgroundPositioning; 
}

export interface VSCodeDokiThemeDefinition {
  id: string;
  overrides: Overrides;
  laf: {
    extends: string;
    ui: StringDictonary<string>;
  };
  backgrounds?: BackgroundPositionings;
  syntax: {};
  colors: {};
}

export interface MasterDokiThemeDefinition {
  id: string;
  name: string;
  displayName: string;
  dark: boolean;
  author: string;
  overrides?: Overrides;
  group: string;
  product?: "community" | "ultimate";
  stickers: Stickers;
  colors: StringDictonary<string>;
}

function getThemeType(dokiThemeTemplateJson: MasterDokiThemeDefinition) {
  return dokiThemeTemplateJson.dark ? "dark" : "light";
}

function resolveTemplate<T, R>(
  childTemplate: T,
  templateNameToTemplate: StringDictonary<T>,
  attributeResolver: (t: T) => R,
  parentResolver: (t: T) => string
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
      ...attributeResolver(childTemplate),
    };
  }
}

function resolveColor(
  color: string,
  namedColors: StringDictonary<string>
): string {
  const startingTemplateIndex = color.indexOf("&");
  if (startingTemplateIndex > -1) {
    const lastDelimeterIndex = color.lastIndexOf("&");
    const namedColor = color.substring(
      startingTemplateIndex + 1,
      lastDelimeterIndex
    );
    const namedColorValue = namedColors[namedColor];
    if (!namedColorValue) {
      throw new Error(`Named color: '${namedColor}' is not present!`);
    }

    // todo: check for cyclic references
    if (color === namedColorValue) {
      throw new Error(
        `Very Cheeky, you set ${namedColor} to resolve to itself 😒`
      );
    }

    const resolvedNamedColor = resolveColor(namedColorValue, namedColors);
    if (!resolvedNamedColor) {
      throw new Error(`Cannot find named color '${namedColor}'.`);
    }
    return resolvedNamedColor + color.substring(lastDelimeterIndex + 1) || "";
  }

  return color;
}

function applyNamedColors(
  objectWithNamedColors: StringDictonary<string>,
  namedColors: StringDictonary<string>
): StringDictonary<string> {
  return Object.keys(objectWithNamedColors)
    .map((key) => {
      const color = objectWithNamedColors[key];
      const resolvedColor = resolveColor(color, namedColors);
      return {
        key,
        value: resolvedColor,
      };
    })
    .reduce((accum: StringDictonary<string>, kv) => {
      accum[kv.key] = kv.value;
      return accum;
    }, {});
}

function buildLAFColors(
  dokiThemeTemplateJson: MasterDokiThemeDefinition,
  dokiVSCodeThemeTemplateJson: VSCodeDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  masterTemplateDefinitions: DokiThemeDefinitions
) {
  const lafTemplates = dokiTemplateDefinitions[LAF_TYPE];
  const lafTemplate = dokiVSCodeThemeTemplateJson.laf.extends
    ? dokiVSCodeThemeTemplateJson.laf
    : dokiThemeTemplateJson.dark
    ? lafTemplates.dark
    : lafTemplates.light;

  const resolvedLafTemplate = resolveTemplate(
    lafTemplate,
    lafTemplates,
    (template) => template.ui,
    (template) => template.extends
  );

  const resolvedNamedColors = resolveNamedColors(
    dokiTemplateDefinitions,
    dokiThemeTemplateJson,
    dokiVSCodeThemeTemplateJson
  );

  const resolvedMasterNameColors = resolveNamedColors(
    masterTemplateDefinitions,
    dokiThemeTemplateJson,
    dokiVSCodeThemeTemplateJson
  );  

  return applyNamedColors(resolvedLafTemplate, {
    ...resolvedMasterNameColors,
    ...resolvedNamedColors,
  });
}

function resolveNamedColors(
  dokiTemplateDefinitions: DokiThemeDefinitions,
  dokiThemeTemplateJson: MasterDokiThemeDefinition,
  dokiThemeVSCodeTemplateJson: VSCodeDokiThemeDefinition
) {
  const colorTemplates = dokiTemplateDefinitions[NAMED_COLOR_TYPE];
  return {
    ...resolveTemplate(
      dokiThemeTemplateJson,
      colorTemplates,
      (template) => template.colors,
      (template) =>
        // @ts-ignore
        template.extends ||
        (template.dark !== undefined &&
          (dokiThemeTemplateJson.dark ? "dark" : "light"))
    ),
    ...dokiThemeVSCodeTemplateJson.colors,
  };
}

function getSyntaxColor(
  syntaxSettingsValue: string,
  resolvedNamedColors: StringDictonary<string>
) {
  if (syntaxSettingsValue.indexOf("&") > -1) {
    return resolveColor(syntaxSettingsValue, resolvedNamedColors);
  } else {
    return syntaxSettingsValue;
  }
}

function buildSyntaxColors(
  dokiThemeTemplateJson: MasterDokiThemeDefinition,
  dokiThemeVSCodeTemplateJson: VSCodeDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  masterTemplateDefinitions: DokiThemeDefinitions
) {
  const syntaxTemplate: any[] =
    dokiTemplateDefinitions[SYNTAX_TYPE].base.tokenColors;

  const overrides =
    dokiThemeTemplateJson.overrides?.editorScheme?.colors ||
    dokiThemeVSCodeTemplateJson?.overrides?.editorScheme?.colors || {};
  const resolvedNamedColors = {
    ...resolveNamedColors(
      masterTemplateDefinitions,
      dokiThemeTemplateJson,
      dokiThemeVSCodeTemplateJson
    ),
    ...resolveNamedColors(
      dokiTemplateDefinitions,
      dokiThemeTemplateJson,
      dokiThemeVSCodeTemplateJson
    ),
    ...overrides,
  };

  return syntaxTemplate.map((tokenSpecification) => {
    const newTokenSpec = {
      ...tokenSpecification,
    };

    const newsettings = Object.keys(newTokenSpec.settings)
      .map((key) => {
        const oldValue = newTokenSpec.settings[key];
        const value = getSyntaxColor(oldValue, resolvedNamedColors);
        return { key, value };
      })
      .reduce((accum: StringDictonary<string>, next) => {
        accum[next.key] = next.value;
        return accum;
      }, {});
    newTokenSpec.settings = newsettings;

    return {
      ...tokenSpecification,
      settings: newsettings,
    };
  });
}

function buildVSCodeTheme(
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiThemeVSCodeDefinition: VSCodeDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  masterTemplateDefinitions: DokiThemeDefinitions,
) {
  return {
    type: getThemeType(dokiThemeDefinition),
    colors: buildLAFColors(
      dokiThemeDefinition,
      dokiThemeVSCodeDefinition,
      dokiTemplateDefinitions,
      masterTemplateDefinitions
    ),
    tokenColors: buildSyntaxColors(
      dokiThemeDefinition,
      dokiThemeVSCodeDefinition,
      dokiTemplateDefinitions,
      masterTemplateDefinitions
    ),
  };
}

function createDokiTheme(
  dokiFileDefinitionPath: string,
  dokiThemeDefinition: MasterDokiThemeDefinition,
  dokiThemeVSCodeDefinition: VSCodeDokiThemeDefinition,
  dokiTemplateDefinitions: DokiThemeDefinitions,
  masterTemplateDefinitions: DokiThemeDefinitions
) {
  try {
    return {
      path: swapMasterThemeForLocalTheme(dokiFileDefinitionPath),
      definition: dokiThemeDefinition,
      backgrounds: dokiThemeVSCodeDefinition.backgrounds,
      theme: buildVSCodeTheme(
        dokiThemeDefinition,
        dokiThemeVSCodeDefinition,
        dokiTemplateDefinitions,
        masterTemplateDefinitions
      ),
    };
  } catch (e) {
    throw new Error(
      `Unable to build ${dokiThemeDefinition.name}'s theme for reasons ${e}`
    );
  }
}

const readJson = <T>(jsonPath: string): T =>
  JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

type TemplateTypes = StringDictonary<StringDictonary<string>>;

const readTemplates = (templatePaths: string[]): TemplateTypes => {
  return templatePaths
    .map((templatePath) => {
      return {
        type: getTemplateType(templatePath),
        template: readJson<any>(templatePath),
      };
    })
    .reduce(
      (accum: TemplateTypes, templateRepresentation) => {
        accum[templateRepresentation.type][
          templateRepresentation.template.name
        ] = templateRepresentation.template;
        return accum;
      },
      {
        [SYNTAX_TYPE]: {},
        [LAF_TYPE]: {},
        [NAMED_COLOR_TYPE]: {},
      }
    );
};

function resolveStickerPath(themeDefinitonPath: string, sticker: string) {
  const stickerPath = path.resolve(
    path.resolve(themeDefinitonPath, ".."),
    sticker
  );
  return stickerPath
    .substring(vsCodeDefinitionDirectoryPath.length)
    .replace(/\\/g, "/");
}

function getThemeGroup(dokiDefinition: MasterDokiThemeDefinition) {
  const themeGroup = dokiDefinition.group;
  const groupMapping = GroupToNameMapping[themeGroup];

  if (!groupMapping) {
    throw new Error(`Unable to find group mapping
        ${themeGroup} for theme ${dokiDefinition.name}`);
  }

  return groupMapping;
}

const getStickers = (
  dokiDefinition: MasterDokiThemeDefinition,
  dokiTheme: any
) => {
  const secondary =
    dokiDefinition.stickers.secondary || dokiDefinition.stickers.normal;
  const backgrounds = dokiTheme.backgrounds;
  return {
    default: {
      path: resolveStickerPath(dokiTheme.path, dokiDefinition.stickers.default),
      name: dokiDefinition.stickers.default,
      anchoring: backgrounds?.default?.anchor || "center",
    },
    ...(secondary
      ? {
          secondary: {
            path: resolveStickerPath(dokiTheme.path, secondary),
            name: secondary,
            anchoring: backgrounds?.secondary?.anchor || "center",
          },
        }
      : {}),
  };
};

const omit = require("lodash/omit");

console.log("Preparing to generate themes.");
walkDir(masterThemeTemplateDirectoryPath)
  .then(readTemplates)
  .then((masterDokiTemplateDefinitions) =>
    walkDir(vsCodeTemplateDirectoryPath)
      .then(readTemplates)
      .then((vsCodeDokiTemplateDefinitions) => ({
        masterDokiTemplateDefinitions,
        vsCodeDokiTemplateDefinitions,
      }))
  )
  .then(({ vsCodeDokiTemplateDefinitions, masterDokiTemplateDefinitions }) => {
    return walkDir(vsCodeDefinitionDirectoryPath)
      .then((files) =>
        files.filter((file) => file.endsWith("vsCode.definition.json"))
      )
      .then((dokiThemeVSCodeDefinitionPaths) => {
        return {
          masterTemplateDefinitions: masterDokiTemplateDefinitions,
          dokiTemplateDefinitions: vsCodeDokiTemplateDefinitions,
          dokiThemeVSCodeDefinitions: dokiThemeVSCodeDefinitionPaths
            .map((dokiThemeVSCodeDefinitionPath) =>
              readJson<VSCodeDokiThemeDefinition>(dokiThemeVSCodeDefinitionPath)
            )
            .reduce(
              (accum: StringDictonary<VSCodeDokiThemeDefinition>, def) => {
                accum[def.id] = def;
                return accum;
              },
              {}
            ),
        };
      });
  })
  .then(({ 
    masterTemplateDefinitions,
    dokiTemplateDefinitions, 
    dokiThemeVSCodeDefinitions 
  }) => {
    return walkDir(masterThemeDefinitionDirectoryPath)
      .then((files) =>
        files.filter((file) => file.endsWith("master.definition.json"))
      )
      .then((dokiFileDefinitionPaths) => {
        return {
          masterTemplateDefinitions,
          dokiTemplateDefinitions,
          dokiThemeVSCodeDefinitions,
          dokiFileDefinitionPaths,
        };
      });
  })
  .then((templatesAndDefinitions) => {
    const {
      masterTemplateDefinitions,
      dokiTemplateDefinitions,
      dokiThemeVSCodeDefinitions,
      dokiFileDefinitionPaths,
    } = templatesAndDefinitions;
    return dokiFileDefinitionPaths
      .map((dokiFileDefinitionPath) => {
        const dokiThemeDefinition = readJson<MasterDokiThemeDefinition>(
          dokiFileDefinitionPath
        );
        const dokiThemeVSCodeDefinition =
          dokiThemeVSCodeDefinitions[dokiThemeDefinition.id];
        if (!dokiThemeVSCodeDefinition) {
          throw new Error(
            `${dokiThemeDefinition.displayName}'s theme does not have a VS Code Definition!!`
          );
        }
        return {
          masterTemplateDefinitions,
          dokiFileDefinitionPath,
          dokiThemeDefinition,
          dokiThemeVSCodeDefinition,
        };
      })
      .filter(
        (pathAndDefinition) =>
          (pathAndDefinition.dokiThemeDefinition.product === "ultimate" &&
            process.env.PRODUCT === "ultimate") ||
          pathAndDefinition.dokiThemeDefinition.product !== "ultimate"
      )
      .map(
        ({
          masterTemplateDefinitions,
          dokiFileDefinitionPath,
          dokiThemeVSCodeDefinition,
          dokiThemeDefinition,
        }) =>
          createDokiTheme(
            dokiFileDefinitionPath,
            dokiThemeDefinition,
            dokiThemeVSCodeDefinition,
            dokiTemplateDefinitions,
            masterTemplateDefinitions,
          )
      );
  })
  .then((dokiThemes) => {
    // write things for extension
    const dokiThemeDefinitions = dokiThemes.map((dokiTheme) => {
      const dokiDefinition = dokiTheme.definition;
      return {
        extensionNames: getCommandNames(dokiDefinition),
        themeDefinition: {
          information: omit(dokiDefinition, [
            "colors",
            "overrides",
            "ui",
            "icons",
          ]),
          stickers: getStickers(dokiDefinition, dokiTheme),
        },
      };
    });
    const finalDokiDefinitions = JSON.stringify(dokiThemeDefinitions);
    fs.writeFileSync(
      path.resolve(repoDirectory, "src", "DokiThemeDefinitions.ts"),
      `export default ${finalDokiDefinitions};`
    );

    // copy to out directory
    const themeOutputDirectory = "generatedThemes";
    const themePostfix = ".theme.json";
    dokiThemes.forEach((dokiTheme) => {
      const vsCodeTheme = dokiTheme.theme;
      fs.writeFileSync(
        path.resolve(
          repoDirectory,
          themeOutputDirectory,
          `${dokiTheme.definition.name}${themePostfix}`
        ),
        JSON.stringify(vsCodeTheme, null, 2)
      );
    });

    // write to package json
    const dokiDefinitions = dokiThemes.map((d) => d.definition);
    const packageJsonPath = path.resolve(repoDirectory, "package.json");
    const packageJson = readJson<any>(packageJsonPath);
    const stickerInstallCommands = dokiDefinitions
      .map((definition) =>
        getCommandNames(definition).map((command) => ({
          command,
          definition,
        }))
      )
      .reduce((accum, next) => accum.concat(next), []);
    const activationEvents = stickerInstallCommands.map(
      (command) => `onCommand:${command.command}`
    );

    const commands = stickerInstallCommands.map((commandAndDefinition) => ({
      command: commandAndDefinition.command,
      title: `Doki-Theme: Install ${commandAndDefinition.definition.name}'s${
        commandAndDefinition.command.endsWith("secondary") ? " Secondary" : ""
      } ${
        commandAndDefinition.command.indexOf('wallpaper') >=0 ? 'Wallpaper' : 'Sticker'
      }`,
    }));

    const ishtarId = '62a4f26f-34b2-46f8-a10c-798e48c1ce9d';
    const themes = dokiDefinitions.map((dokiDefinition) => ({
      id: dokiDefinition.id,
      label: `Doki Theme: ${getThemeGroup(dokiDefinition)} ${
        dokiDefinition.displayName
      }`,
      path: `./${themeOutputDirectory}/${dokiDefinition.name}${themePostfix}`,
      uiTheme: dokiDefinition.dark ? "vs-dark" : "vs",
    })).sort((a, b) => {
      if(a.id === ishtarId) {
        return -1;
      } else if (b.id === ishtarId) {
        return 1;
      } else {
        return a.label.localeCompare(b.label);
      }
    });

    packageJson.activationEvents = [
      ...packageJson.activationEvents.filter(
        (activationEvent: string) =>
          !activationEvent.startsWith("onCommand:doki-theme.theme")
      ),
      ...activationEvents,
    ];

    packageJson.contributes.commands = [
      ...packageJson.contributes.commands.filter(
        (command: { command: string }) =>
          !command.command.startsWith("doki-theme.theme")
      ),
      ...commands,
    ];
    packageJson.contributes.themes = themes;
    return new Promise((resolve, reject) =>
      fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      )
    );
  })
  .then(() => {
    // UPDATE CHANGELOG
    const MarkItDown = require("markdown-it");
    const markdownConverter = new MarkItDown();

    const changelogPath = path.join(repoDirectory, "CHANGELOG.md");
    const changelogText = fs.readFileSync(changelogPath, "utf-8");

    const changelogHTML = markdownConverter.render(changelogText);

    fs.writeFileSync(
      path.resolve(repoDirectory, "src", "ChangelogHtml.ts"),
      `export default \`${changelogHTML}\`;`
    );
  })
  .then(() => {
    console.log("Theme Generation Complete!");
  });

function getCommandNames(dokiDefinition: MasterDokiThemeDefinition): string[] {
  return keys(dokiDefinition.stickers)
    .filter((type) => type !== "normal")
    .map((type) => {
      if (type === "default") {
        return [
          `doki-theme.theme.${dokiDefinition.name}`,
          `doki-theme.theme.wallpaper.${dokiDefinition.name}`
        ];
      }
      return [
        `doki-theme.theme.${dokiDefinition.name}.secondary`,
        `doki-theme.theme.wallpaper.${dokiDefinition.name}.secondary`,
      ];
    }).reduce((accum, next) => accum.concat(next), []);
}
