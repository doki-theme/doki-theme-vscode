import * as vscode from "vscode";
import DokiThemeDefinitions from "./DokiThemeDefinitions";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { VSCodeDokiThemeDefinition } from "./extension";


const showNonOp = () => vscode.window
  .showInformationMessage(
    `This feature does not work on the web version of VSCode 🥲`,
    { title: "That does not work." }
  );

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("doki-theme.remove.sticker", () =>
      showNonOp()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doki-theme.doki.changelog", () =>
      showNonOp()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doki-theme.remove.watermark", () =>
      showNonOp()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("doki-theme.restore.assets", () =>
      showNonOp()
    )
  );

  VSCodeGlobals.globalState = context.globalState;

  DokiThemeDefinitions.map((dokiThemeDefinition: VSCodeDokiThemeDefinition) =>
    dokiThemeDefinition.extensionNames.map((extensionCommand) => ({
      extensionCommand,
      dokiThemeDefinition,
    }))
  )
    .reduce((accum, next) => accum.concat(next), [])
    .map(({ extensionCommand }) =>
      vscode.commands.registerCommand(extensionCommand, () => {
        showNonOp()
      }
      )
    )
    .forEach((disposableHero) => context.subscriptions.push(disposableHero));

}

export function deactivate() {
}
