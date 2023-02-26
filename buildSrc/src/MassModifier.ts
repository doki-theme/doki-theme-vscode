import { readJson, walkDir } from "doki-build-source";
import path from "path";
import fs from "fs";

console.log(path.resolve('.'));

walkDir(path.resolve('.', 'assets', 'themes'))
  .then((files) => files.filter((file) => file.endsWith("vsCode.definition.json"))
  )
  .then((dokiFileDefinitionPaths) => {
    return {
      dokiFileDefinitionPaths,
    };
  })
  .then((templatesAndDefinitions) => {
    const { dokiFileDefinitionPaths } = templatesAndDefinitions;
    return dokiFileDefinitionPaths.map((dokiFileDefinitionPath) => ({
      dokiFileDefinitionPath,
      dokiThemeDefinition: readJson<any>(
        dokiFileDefinitionPath
      ),
    }));
  })
  .then((defs) => {

    console.log(
      Object.keys(
        defs.map(a => a.dokiThemeDefinition.characterId).reduce((acc, id) => {
          acc[id] = id;
          return acc;
        }, {})).length
    );
    defs.forEach(({
      dokiFileDefinitionPath,
      dokiThemeDefinition,
    }) => {
      const selectionBackground = dokiThemeDefinition.laf?.ui?.['selection.background'];
      console.log(`${dokiThemeDefinition.id}: ${selectionBackground}`);
      // if (selectionBackground === '&selectionBackground&') {
      //   delete dokiThemeDefinition.laf?.ui?.['selection.background'];
      //   fs.writeFileSync(
      //     dokiFileDefinitionPath,
      //     JSON.stringify(
      //       dokiThemeDefinition, null, 2
      //     )
      //   )
      // }
    });

  });
