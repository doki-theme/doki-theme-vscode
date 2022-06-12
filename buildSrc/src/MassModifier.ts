import { readJson, walkDir } from "doki-build-source";
import path from "path";
import fs from "fs";

console.log(path.resolve('.'));

walkDir(path.resolve('..','masterThemes','definitions'))
  .then((files) => files.filter((file) => file.endsWith("master.definition.json"))
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
    })=>{
      delete dokiThemeDefinition.backgrounds;
      // fs.writeFileSync(
      //   dokiFileDefinitionPath,
      //   JSON.stringify(
      //     dokiThemeDefinition, null, 2
      //   )
      // )
    });

  });
