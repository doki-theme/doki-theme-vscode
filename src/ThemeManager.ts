import * as vscode from "vscode";
import {DokiTheme} from "./DokiTheme";
import {installSticker} from "./StickerService";
import { VSCodeGlobals } from "./VSCodeGlobals";
import { StatusBarComponent } from "./StatusBar";

export const ACTIVE_THEME = 'doki.theme.active';

export function activateTheme(dokiTheme: DokiTheme) {
  installSticker(dokiTheme);

  VSCodeGlobals.globalState.update(ACTIVE_THEME, dokiTheme.displayName);
  StatusBarComponent.setText(dokiTheme.displayName);

  vscode.window.showInformationMessage(`${dokiTheme.name} has been activated, please restart your IDE`);
}


