import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker} from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";

export const ACTIVE_THEME = 'doki.theme.active';

export function activateTheme(dokiTheme: DokiTheme) {
  VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.displayName);
  StatusBarComponent.setText(dokiTheme.displayName);
  const didInstall = installSticker(dokiTheme);
  if(didInstall) {
    vscode.window.showInformationMessage(`${dokiTheme.name} has been activated, please restart your IDE`);
  } else {
    // todo: show how to corrupt webview
    vscode.window.showInformationMessage(`Unable to install ${dokiTheme.name}, please see active tab for more information.`);
  }


}


