import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker, removeStickers} from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";

export const ACTIVE_THEME = 'doki.theme.active';

export function activateTheme(dokiTheme: DokiTheme) {
  VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.displayName);
  StatusBarComponent.setText(dokiTheme.displayName);
  const didInstall = installSticker(dokiTheme);
  if(didInstall) {
    vscode.window.showInformationMessage(`${dokiTheme.name} installed!\n Please restart your c͇o̪̜r̴̫̮̰͖r̨ư̼͎p͙̞̻͇̤̠t́e̙̘͓͓̻̰̩d̯͙ IDE`);
  } else {
    // todo: show how to corrupt webview
    vscode.window.showErrorMessage(`Unable to install ${dokiTheme.name}, please see active tab for more information.`);
  }
}


// :(
export function uninstallImages(){
  const stickersRemoved = removeStickers();
  if(stickersRemoved) {
    vscode.window.showInformationMessage(`Removed Images. Please restart your un-c͇o̪̜r̴̫̮̰͖r̨ư̼͎p͙̞̻͇̤̠t́e̙̘͓͓̻̰̩d̯͙ IDE`);
  }
}