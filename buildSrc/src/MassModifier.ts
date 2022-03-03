import { readJson, walkDir } from "doki-build-source";
import path from "path";
import fs from "fs";

console.log(path.resolve('.'));

walkDir(path.resolve('.','assets','themes'))
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
